exports.parseLinksOfIphones = async (url, browser) => {
  await browser.url(url);

  const searchLink = await browser.$("#headerSearch");
  await searchLink.setValue("iphone");
  const searchButton = await browser.$(".button");
  await searchButton.click();
  const searchResultList = await browser.$$(".detailsLink");
  const listOfPromiseIphonesLinks = await searchResultList.map(
    async (item, index) => {
      const link = await item.getAttribute("href");
      const title = await searchResultList[index].getText();
      return { link: link, title: title };
    }
  );
  const listOfIphonesLinks = Promise.all(listOfPromiseIphonesLinks);

  const filteredIphonesLinks = (await listOfIphonesLinks).filter((item) => {
    return item.title !== "" && item.title !== "Без фото";
  });

  return filteredIphonesLinks;
};

exports.parseDataFromIphone = async (url, browser) => {
  await browser.createWindow("/");
  await browser.url(url);

  const parseAdTitle = await browser.$('[data-cy="ad_title"]');
  const getTitleText =
    (await parseAdTitle.isExisting()) && (await parseAdTitle.getText());
  const parseAdPrice = await browser.$('[data-testid="ad-price-container"]');
  const getPriceText =
    (await parseAdPrice.isExisting()) && (await parseAdPrice.getText());
  const parseAdDiscription = await browser.$(".css-g5mtbi-Text");
  const getDiscriptionText =
    (await parseAdDiscription.isExisting()) &&
    (await parseAdDiscription.getText());

  return {
    title: getTitleText,
    price: getPriceText,
    discription: getDiscriptionText,
    url: url,
  };
};
