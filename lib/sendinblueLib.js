import sbapi from "@/config/sendinblue";

const sendinblueLib = {
  async createOrUpdateContact({ email, attributes, listIds = "" }) {
    //create contact in sendinblue
    //if contact already exists, and has
    try {
      const apiInstance = new sbapi.ContactsApi();

      //parse listIds
      listIds = parseListIds(listIds);

      //check if contact exists in sendinblue
      let contactExist = null;
      try {
        contactExist = await apiInstance.getContactInfo(email);
      } catch (error) {
        console.info("contact not found in sendinblue");
      }

      if (contactExist) {
        //get the listIds that are not in contactExist.listIds

        const listIdsToAdd = listIds.filter(
          (id) => !contactExist.listIds.includes(id)
        );

        //eliminate duplicates
        const listIdsToAddUnique = [...new Set(listIdsToAdd)];

        const contactData = {
          email,
          attributes,
        };

        if (listIdsToAddUnique && listIdsToAddUnique.length > 0) {
          contactData.listIds = listIdsToAddUnique;
        }

        //update contact
        await sendinblueLib.updateContact(contactData);
        console.info("contact already existed, updated in sendinblue");
        return; //do nothing else
      }

      //if contact does not exist, create it
      const createContactData = new sbapi.CreateContact();
      createContactData.email = email;
      createContactData.attributes = attributes;
      if (listIds && listIds.length > 0) createContactData.listIds = listIds;
      await apiInstance.createContact(createContactData);
      console.info("New Contact created in Sendinblue");
    } catch (error) {
      console.error("error creating or updating contact in sendinblue", error);
    }
  },
  async updateContact({ email, attributes, listIds }) {
    //list ids should  an array of numbers
    try {
      const apiInstance = new sbapi.ContactsApi();
      const updateContact = new sbapi.UpdateContact();
      updateContact.attributes = attributes;
      if (listIds) updateContact.listIds = listIds;
      await apiInstance.updateContact(email, updateContact);
    } catch (error) {
      console.info("error updating contact in sendinblue");
    }
  },
};

//UTILS
const parseListIds = (listIds) => {
  //receives a string of numbers separated by commas
  //and return an array of numbers or an empty array if no listIds
  if (!listIds) return [];
  let _listIds = listIds.split(",");
  _listIds = _listIds.map((id) => parseInt(id));
  return _listIds;
};

export default sendinblueLib;
