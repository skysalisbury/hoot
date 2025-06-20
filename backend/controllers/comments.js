const Hoot = require('../models/hoot');

module.exports = {
  create,
  show,
  update,
  deleteComment,
};

async function create(req, res) {
  console.log(req.params.hootId);
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.findById(req.params.hootId);

    // Add the comment to the hoot
    hoot.comments.push(req.body);
    await hoot.save();

    // Get the newly created comment
    const newComment = hoot.comments[hoot.comments.length - 1];

    // Populate the author for the entire comments array
    await hoot.populate('comments.author');

    // Respond with the populated comment:
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

async function show(req, res) {
  try {
    const hoot = await Hoot.findById(req.params.hootId).populate(
      'comments.author'
    );
    const comment = hoot.comments.id(req.params.commentId); // correct way to access subdoc

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch comment' });
  }
}

async function update(req, res) {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    const comment = hoot.comments.id(req.params.commentId);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (!comment.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to update this comment");
    }

    comment.text = req.body.text || comment.text;
    await hoot.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to update comment' });
  }
}

async function deleteComment(req, res) {
  const hoot = await Hoot.findById(req.params.hootId);
  hoot.comments = hoot.comments.filter(
    (comment) => comment._id.toString() !== req.params.commentId
  );
  await hoot.save();
  res.sendStatus(204);
}
