const { remote } = require("webdriverio");
const { MongoClient } = require("mongodb");
const { parseLinksOfIphones, parseDataFromIphone } = require("./utils/parser");
const { addDataToMongoDB } = require("./utils/mongodb");

const URL =
  "mongodb+srv://kolodka:qwerty12345@cluster0.zyp9z.mongodb.net/RegDesk-Webdriver-parser?retryWrites=true&w=majority";

const client = new MongoClient(URL);

const startApp = async () => {
  let listOfIphoneData = [];
  try {
    await client.connect();

    const browser = await remote({
      capabilities: {
        browserName: "chrome",
      },
    });

    const linksData = await parseLinksOfIphones("https://www.olx.ua/", browser);

    for (const data of linksData) {
      const adData = await parseDataFromIphone(data.link, browser);
      listOfIphoneData.push(adData);
    }

    await addDataToMongoDB(client, "iphone_links", linksData);
    await addDataToMongoDB(client, "iphone_data", listOfIphoneData);
    await browser.deleteSession();
  } catch (error) {
    console.log(error);
  }
};

startApp();
