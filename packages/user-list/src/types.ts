export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addresses: Address[];
  role: 'admin' | 'supervisor' | 'associate';
  createdAt: string;
  updatedAt: string;
}

export interface UserListProps {
  users: User[];
  role: 'admin' | 'supervisor' | 'associate';
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete?: (userId: string) => void;
}
