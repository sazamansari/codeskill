import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { ProblemMetadata } from './problem-metadata.entity';

@Entity('contests')
export class Contest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @ManyToMany(() => ProblemMetadata)
  @JoinTable({
    name: 'contest_problems',
    joinColumn: { name: 'contest_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'problem_id', referencedColumnName: 'id' }
  })
  problems: ProblemMetadata[];

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'jsonb', default: {
    enableFullscreen: true,
    enableCopyProtect: true,
    enablePasteProtect: true,
    enableDevToolsDetect: true,
    enableTabSwitchDetect: true,
    enableMultipleDeviceProtect: true,
    enableWatermark: true,
    warningLimit: 5,
    autoSubmitOnViolation: true
  } })
  antiCheatConfig: any;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'contest_participants',
    joinColumn: { name: 'contest_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  participants: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
