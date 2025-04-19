import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('iGUsers')
export class User extends BaseEntity {
  // # | ---------------------------------------------------------------------- | #
  // # | Basic User Information - Defaults
  // # | ---------------------------------------------------------------------- | #
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;
  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;
  @Column({ type: 'varchar', nullable: true })
  verifyToken: string | null;
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
}
