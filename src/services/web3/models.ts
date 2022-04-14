import { TokenInput } from 'nft.storage/dist/src/lib/interface';

export class BaseNFTModel<Properties> implements Omit<TokenInput, 'image'> {
  name: string;

  description: string;

  image: File | string;

  properties: Properties;

  constructor(data: BaseNFTModel<Properties>) {
    this.name = data.name;
    this.description = data.description;
    this.image = data.image;
    this.properties = data.properties;
  }
}

export interface CommunityRoleSkill {
  name: string;
  [key: string]: any;
}

export interface CommunityRole {
  id: number;
  roleName: string;
  isCoreTeamMember: boolean;
  skills: CommunityRoleSkill[] | string[];
}

export class CommunityProperties {
  skills: {
    roles: CommunityRole[];
  };

  template: string;

  constructor(data: CommunityProperties) {
    if (!data) {
      this.skills = {
        roles: [],
      };
    } else {
      this.skills = data.skills;
      this.template = data.template;
    }
  }
}

export class Community extends BaseNFTModel<CommunityProperties> {
  constructor(data: Community = {} as Community) {
    super(data);
    this.properties = new CommunityProperties(data.properties);
  }
}

export interface PartnerAgreementKey {
  address: string;
  partnersAgreementAddress: string;
  communityAddress: string;
  discordWebhookUrl: string;
  key: string;
}

export const DefaultRoles: CommunityRole[] = [
  {
    id: 4,
    roleName: 'Core Team',
    skills: [],
    isCoreTeamMember: true,
  },
  {
    id: 5,
    roleName: 'Advisor',
    skills: [],
    isCoreTeamMember: true,
  },
  {
    id: 6,
    roleName: 'Investor',
    skills: [],
    isCoreTeamMember: true,
  },
];
