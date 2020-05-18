import BackendService from './BackendService';

test("get groups", async () => {
    var backend = new BackendService();
    var groups = await backend.getGroups();
    console.log(groups);
    console.log(await groups[0].getChats());
});