// Receives Netlify Forms' outgoing webhook for the "contact" form and
// upserts the submission into HubSpot as a contact + note. Configure the
// webhook URL in Netlify: Site settings > Forms > Form notifications >
// Outgoing webhook, pointing at /.netlify/functions/hubspot-lead. Requires
// the HUBSPOT_TOKEN environment variable (a HubSpot private app token with
// crm.objects.contacts.write and crm.objects.notes.write scopes) to be set
// in Netlify: Site settings > Environment variables.

const HUBSPOT_API = 'https://api.hubapi.com';
const NOTE_TO_CONTACT_ASSOCIATION_TYPE_ID = 202; // HubSpot's standard "note to contact" association type

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.HUBSPOT_TOKEN;
  if (!token) {
    console.error('HUBSPOT_TOKEN is not set');
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  let data;
  try {
    const body = JSON.parse(event.body);
    data = (body.payload && body.payload.data) || {};
  } catch (err) {
    return { statusCode: 400, body: 'Invalid payload' };
  }

  const { name, email, message } = data;
  if (!email) {
    return { statusCode: 400, body: 'Missing email' };
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    let contactId;

    const createRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        properties: { email, firstname: name || '', lifecyclestage: 'lead' },
      }),
    });

    if (createRes.ok) {
      contactId = (await createRes.json()).id;
    } else if (createRes.status === 409) {
      const searchRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/search`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
          limit: 1,
        }),
      });
      const searchData = await searchRes.json();
      contactId = searchData.results && searchData.results[0] && searchData.results[0].id;
    } else {
      console.error('HubSpot contact creation failed:', await createRes.text());
      return { statusCode: 502, body: 'HubSpot error' };
    }

    if (contactId && message) {
      const noteRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/notes`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          properties: {
            hs_note_body: `Message reçu via le formulaire de contact du site :\n\n${message}`,
            hs_timestamp: Date.now(),
          },
          associations: [
            {
              to: { id: contactId },
              types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: NOTE_TO_CONTACT_ASSOCIATION_TYPE_ID }],
            },
          ],
        }),
      });
      if (!noteRes.ok) {
        console.error('HubSpot note creation failed:', await noteRes.text());
      }
    }

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('Unexpected error calling HubSpot:', err);
    return { statusCode: 500, body: 'Unexpected error' };
  }
};
