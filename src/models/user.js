import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    // автоматично буде додавати до об'єкту два поля: createdAt (дата створення) та updatedAt (дата оновлення).
    timestamps: true,
    // вимикає службове поле __v
    versionKey: false,
  },
);
userSchema.pre('save', function () {
  if (!this.username) {
    this.username = this.email;
  }
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model('User', userSchema);
//export const Student = mongoose.model("Student", studentSchema);
