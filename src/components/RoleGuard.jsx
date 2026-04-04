import useStore from '../store/store';

export default function RoleGuard({ children, requiredRole = 'admin', fallback = null }) {
  const { role } = useStore();

  if (requiredRole === 'admin' && role !== 'admin') {
    return fallback;
  }

  return children;
}
