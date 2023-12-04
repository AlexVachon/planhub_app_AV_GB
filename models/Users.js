const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserModel = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Vous devez fournir un prénom"],
    trim: true,
    maxlength: [50, "Votre prénom ne peut pas dépasser 50 caractères"],
    minlength: [3, "Votre prénom doit contenir au minimum 3 caractères"],
    validate: {
      validator: function (v) {
        const fnRegex = /^[a-zA-Z]{3,50}$/;
        return fnRegex.test(v);
      },
      message:
        "Le prénom doit contenir uniquement des lettres (entre 3 et 50 caractères).",
    },
  },
  last_name: {
    type: String,
    required: [true, "Vous devez fournir un nom"],
    trim: true,
    maxlength: [50, "Votre nom ne peut pas dépasser 50 caractères"],
    minlength: [3, "Votre nom doit contenir au minimum 3 caractères"],
    valida: {
      validator: function (v) {
        const lnRegex = /^[a-zA-Z]{3,50}$/;
        return lnRegex.test(v);
      },
      message:
        "Le nom doit contenir uniquement des lettres (entre 3 et 50 caractères).",
    },
  },
  username: {
    type: String,
    required: [true, "Vous devez fournir un Username"],
    trim: true,
    maxlength: [20, "Votre Username ne peut pas dépasser 20 caractères"],
    minlength: [8, "Votre Username doit contenir au minimum 8 caractères"],
    validate: [
      {
        validator: async function (v) {
          const existingUsername = await this.constructor.findOne({
            username: v,
          });
          return !existingUsername;
        },
        message: "Ce nom d'utilisateur est déjà utilisé.",
      },
      {
        validator: function (v) {
          const unRegex = /^[a-zA-Z0-9_]{8,20}$/;
          return unRegex.test(v);
        },
        message: "Le nom d'utilisateur doit contenir entre 3 et 50 caractères.",
      },
    ],
  },
  email: {
    type: String,
    required: [true, "Vous devez fournir une adresse courriel"],
    maxlength: [
      100,
      "Votre adresse courriel ne peut pas dépasser 100 caractères.",
    ],
    trim: true,
    validate: [
      {
        validator: async function (v) {
          const existingEmail = await this.constructor.findOne({ email: v });
          return !existingEmail;
        },
        message: "Ce courriel est déjà utilisé.",
      },
      {
        validator: function (v) {
          const emRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emRegex.test(v);
        },
        message: "Le format du courriel n'est pas valide.",
      },
    ],
  },
  password: {
    type: String,
    required: [true, "Vous devez fournir un mot de passe"],
    trim: true,
    minlength: [8, "Votre mot de passe doit contenir au minimum 8 caractères"],
    validate: {
      validator: function (v) {
        const pwRegex = /^.{8,}/;
        return pwRegex.test(v);
      },
      message: "Le mot de passe n'est pas valide",
    },
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

UserModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("Users", UserModel);
