exports.addDataToMongoDB = async (client, collection, linksData) => {
  const linksOfIphones = client.db().collection(collection);
  await linksOfIphones.insertMany(linksData);
  const toShowAllDocuments = await linksOfIphones
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  console.log("Show All: ", toShowAllDocuments);
};
