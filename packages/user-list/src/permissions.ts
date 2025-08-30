export interface Permission {
  canAdd: boolean;
  canEdit: boolean;
  canView: boolean;
}

export const ROLE_PERMISSIONS: Record<string, Permission> = {
  admin: {
    canAdd: true,
    canEdit: true,
    canView: true,
  },
  supervisor: {
    canAdd: false,
    canEdit: true,
    canView: true,
  },
  associate: {
    canAdd: false,
    canEdit: false,
    canView: true,
  },
};
