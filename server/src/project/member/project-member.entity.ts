import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../project.entity';
import { Tag } from '../../tag/tag.entity';
import { User } from '../../user/user.entity';
@Entity()
export class ProjectMember {
  @ManyToOne(() => Project, (project) => project.projectMember,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'projectId' })
  project!: Project;
  @PrimaryColumn()
  projectId!: number;
  @ManyToOne(() => Tag)
  tag!: Tag;
  @PrimaryColumn()
  tagId!: number;
  @ManyToOne(() => User, (user) => user.projectMember)
  user!: User;
  @PrimaryColumn()
  userId!: number;
}
