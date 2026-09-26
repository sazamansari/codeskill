import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export type UserDocument = HydratedDocument<User>;

class Profile {
  @Prop({ default: '' })
  institution: string;

  @Prop({
    enum: ['student', 'professional', 'educator', 'other'],
    default: 'student',
  })
  role: string;

  @Prop({ default: 'python' })
  preferredLanguage: string;

  @Prop({ enum: ['light', 'dark'], default: 'light' })
  theme: string;

  @Prop({ default: 14, min: 11, max: 22 })
  fontSize: number;
}

class Stats {
  @Prop({ default: 0 })
  totalSolved: number;

  @Prop({ default: 0 })
  easySolved: number;

  @Prop({ default: 0 })
  mediumSolved: number;

  @Prop({ default: 0 })
  hardSolved: number;

  @Prop({ default: 0 })
  dsaSolved: number;

  @Prop({ default: 0 })
  sqlSolved: number;

  @Prop({ default: 0 })
  jsSolved: number;

  @Prop({ default: 0 })
  currentStreak: number;

  @Prop({ default: 0 })
  longestStreak: number;

  @Prop({ default: 0 })
  totalSubmissions: number;

  @Prop({ default: 0 })
  acceptedSubmissions: number;

  @Prop({ default: 0 })
  xp: number;
}

class Badge {
  @Prop()
  badgeId: string;

  @Prop({ default: Date.now })
  unlockedAt: Date;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, maxlength: 50 })
  name: string;

  @Prop({ unique: true, sparse: true, lowercase: true, trim: true })
  username?: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  })
  email: string;

  @Prop({ minlength: 6, select: false })
  password?: string;

  @Prop({
    enum: ['local', 'google', 'github', 'linkedin', 'otp'],
    default: 'local',
  })
  authProvider: string;

  @Prop()
  googleId?: string;

  @Prop()
  githubId?: string;

  @Prop()
  linkedinId?: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ maxlength: 200, default: '' })
  bio: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ type: Profile, default: () => ({}) })
  profile: Profile;

  @Prop({ type: Stats, default: () => ({}) })
  stats: Stats;

  @Prop([String])
  solvedProblems: string[];

  @Prop([String])
  bookmarkedProblems: string[];

  @Prop([Badge])
  badges: Badge[];

  @Prop({ type: Map, of: Number, default: {} })
  activityMap: Map<string, number>;

  @Prop({ type: Map, of: String, default: {} })
  notes: Map<string, string>;

  @Prop({ default: Date.now })
  lastActive: Date;

  @Prop()
  lastSolveDate?: Date;

  // Methods
  matchPassword?: (entered: string) => Promise<boolean>;
  getSignedJwtToken?: () => string;
  updateStreak?: () => void;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hooks
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Methods
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || 'supersecretcodeskilljwt',
    {
      expiresIn: (process.env.JWT_EXPIRE || '30d') as any,
    },
  );
};

UserSchema.methods.updateStreak = function () {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (this.lastSolveDate) {
    const lastDate = this.lastSolveDate.toISOString().split('T')[0];
    if (lastDate === today) return; // Already solved today
    if (lastDate === yesterday) {
      this.stats.currentStreak += 1;
    } else {
      this.stats.currentStreak = 1;
    }
  } else {
    this.stats.currentStreak = 1;
  }

  if (this.stats.currentStreak > this.stats.longestStreak) {
    this.stats.longestStreak = this.stats.currentStreak;
  }

  this.lastSolveDate = new Date();
  this.activityMap.set(today, (this.activityMap.get(today) || 0) + 1);
};
