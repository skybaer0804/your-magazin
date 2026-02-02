import SiteConfig from '../models/SiteConfig.js';

export const getConfig = async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create({
        siteTitle: 'YOUR MAGAZINE',
        logoText: 'M',
        menus: []
      });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const { siteTitle, logoText, menus } = req.body;
    
    // 메뉴 개수 및 글자수 제한 검증
    if (menus && menus.length > 5) {
      return res.status(400).json({ message: '메뉴는 최대 5개까지만 설정 가능합니다.' });
    }
    
    if (menus && menus.some(menu => menu.title.length > 6)) {
      return res.status(400).json({ message: '메뉴 이름은 최대 6글자까지 가능합니다.' });
    }

    let config = await SiteConfig.findOne();
    if (!config) {
      config = new SiteConfig();
    }

    if (siteTitle !== undefined) config.siteTitle = siteTitle;
    if (logoText !== undefined) config.logoText = logoText;
    if (menus !== undefined) config.menus = menus;

    await config.save();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
