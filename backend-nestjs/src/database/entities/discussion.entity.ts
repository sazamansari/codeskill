import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';

@Entity('discussions')
@Index(['problemId', 'createdAt'])
@Index(['problemId', 'upvotes'])
export class Discussion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @Column()
  @Index()
  problemId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column()
  author_id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 5000 })
  body: string;

  @Column({ type: 'jsonb', default: ['general'] })
  tags: string[];

  @Column({ default: 0 })
  upvotes: number;

  @Column({ default: 0 })
  downvotes: number;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'discussion_upvotes',
    joinColumn: { name: 'discussion_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  upvotedBy: User[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'discussion_downvotes',
    joinColumn: { name: 'discussion_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  downvotedBy: User[];

  @Column({ default: 0 })
  replyCount: number;

  @Column({ default: false })
  isPinned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
