import Link from 'next/link';

interface NavBarProps {}

const NavBar = ({}: NavBarProps) => {
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

  const companyName = 'yourName';

  const navLinks = navItems.map((item, id) => (
    <Link key={id} href={item.href}>
      <p className="hover:text-blue-300 hover:cursor-pointer select-none">
        {item.name}
      </p>
    </Link>
  ));
  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-500 flex justify-center">
      <div className="navbar max-w-5xl">
        <div className="flex-1">
          <span className="btn btn-ghost normal-case text-xl">
            <Link href={'/'}>{companyName}</Link>
          </span>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal p-0 flex gap-5">{navLinks}</ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
