import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { ProjectAplication } from '../project/aplication/project-aplication.entity';
import { ProjectMember } from '../project/member/project-member.entity';
import { UserStatus } from './user.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  technologies!: Tag[];

  @ManyToMany(() => Tag)
  @JoinTable()
  specializations!: Tag[];

  @Column()
  linkedin?: string;

  @Column({ nullable: true })
  discord?: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  phone!: string;

  @Column()
  city!: string;

  @Column()
  country?: string;

  @Column({ default: true })
  discordReceiving?: boolean;

  @OneToMany(
    () => ProjectAplication,
    (projectAplications) => projectAplications.project,
  )
  projectAplications!: ProjectAplication[];

  @OneToMany(() => ProjectMember, (projectMember) => projectMember.project)
  projectMember!: ProjectMember[];

  @Column({ enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Column({ nullable: false })
  registerAt!: Date;
}
