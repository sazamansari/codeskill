import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'Easy',
  })
  difficulty: string;

  @Column({ type: 'text', nullable: true })
  constraints?: string;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'int', default: 2000 })
  timeLimit: number;

  @Column({ type: 'int', default: 256 })
  memoryLimit: number;

  @Column({ type: 'jsonb', default: {} })
  starterCode: Record<string, string>;

  @Column({ type: 'jsonb', default: [] })
  testCases: {
    input: string;
    output: string;
    isHidden: boolean;
    explanation?: string;
  }[];

  @Column('text', { array: true, default: '{}' })
  hints: string[];

  @Column({ type: 'text', nullable: true })
  editorial?: string;

  @Column({ type: 'jsonb', default: {} })
  stats: {
    totalSubmissions?: number;
    acceptedSubmissions?: number;
    acceptanceRate?: number;
  };

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
