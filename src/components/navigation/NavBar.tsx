import Link from 'next/link';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}: NavBarProps) => {
  const navItems = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Calendar',
      href: '/calendar',
    },
    {
      name: 'Break Timer',
      href: '/breaktimer',
    },
  ];
  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center bg-blue-500 text-lg h-[60px]">
      <div></div>
      <div className="flex gap-5 mr-5">
        {navItems.map((item, id) => (
          <Link key={id} href={item.href}>
            <p className="hover:text-blue-300 hover:cursor-pointer select-none">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
