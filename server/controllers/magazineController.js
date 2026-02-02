import Magazine from '../models/Magazine.js';

export const getMagazines = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, sort = 'latest', menuId } = req.query;

    const query = { status: 'published' };
    if (category) {
      query.category = category;
    }
    if (menuId) {
      query.menuId = menuId;
    }

    let sortOption = { publishedAt: -1 };
    if (sort === 'popular') sortOption = { likes: -1, publishedAt: -1 };
    if (sort === 'views') sortOption = { viewCount: -1, publishedAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [magazines, total] = await Promise.all([
      Magazine.find(query)
        .populate('author', 'name image')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Magazine.countDocuments(query),
    ]);

    res.json({
      magazines,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMagazineById = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id)
      .populate('author', 'name image bio')
      .populate('comments.author', 'name image');

    if (!magazine) {
      return res.status(404).json({ message: '매거진을 찾을 수 없습니다.' });
    }

    magazine.viewCount += 1;
    await magazine.save();

    res.json(magazine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMagazine = async (req, res) => {
  try {
    const { title, description, content, coverImage, category, tags, status, menuId } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: '제목과 내용은 필수입니다.',
      });
    }

    const magazine = await Magazine.create({
      title,
      description: description || '',
      content,
      coverImage: coverImage || null,
      category: category || 'other',
      tags: tags || [],
      status: status || 'published',
      author: req.user.id,
      menuId: menuId || null,
    });

    const populated = await Magazine.findById(magazine._id)
      .populate('author', 'name image');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMagazine = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);

    if (!magazine) {
      return res.status(404).json({ message: '매거진을 찾을 수 없습니다.' });
    }

    if (magazine.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '수정 권한이 없습니다.' });
    }

    const { title, description, content, coverImage, category, tags, status, menuId } = req.body;

    if (title) magazine.title = title;
    if (description !== undefined) magazine.description = description;
    if (content) magazine.content = content;
    if (coverImage !== undefined) magazine.coverImage = coverImage;
    if (category) magazine.category = category;
    if (tags) magazine.tags = tags;
    if (status) magazine.status = status;
    if (menuId !== undefined) magazine.menuId = menuId;

    await magazine.save();

    const updated = await Magazine.findById(magazine._id)
      .populate('author', 'name image');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMagazine = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);

    if (!magazine) {
      return res.status(404).json({ message: '매거진을 찾을 수 없습니다.' });
    }

    if (magazine.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    await Magazine.findByIdAndDelete(req.params.id);
    res.json({ message: '매거진이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLikeMagazine = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);

    if (!magazine) {
      return res.status(404).json({ message: '매거진을 찾을 수 없습니다.' });
    }

    const isLiked = magazine.likedBy.includes(req.user.id);

    if (isLiked) {
      // 이미 좋아요를 누른 경우 취소
      magazine.likedBy = magazine.likedBy.filter((id) => id.toString() !== req.user.id);
      magazine.likes = Math.max(0, magazine.likes - 1);
    } else {
      // 좋아요 추가
      magazine.likedBy.push(req.user.id);
      magazine.likes += 1;
    }

    await magazine.save();

    res.json({
      likes: magazine.likes,
      isLiked: !isLiked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMagazinesByMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const magazines = await Magazine.find({ menuId, status: 'published' })
      .select('title _id')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(magazines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
