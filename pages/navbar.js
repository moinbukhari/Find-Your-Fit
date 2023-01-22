import Image from 'next/image';
import appLogo from '../assets/logo1.png';

const NavBar = () => {

    return(
        
        <div className="px-6 pt-6 lg:px-8 mb-6">
            <div>
            <nav className="flex h-9 items-center justify-between" aria-label="Global">
                <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                <a href="/" className="flex -m-1.5 p-1.5 text-center ">
                    
                    <Image className="h-10 w-10 rounded-full mr-1" src={appLogo} alt="" />
                    <span className="font-mono tracking-tighter font-bold text-lg flex items-center text-left ">Find Your Fit</span>
                </a>
                </div>
                {/* <div className="flex lg:hidden">
                <button
                    type="button"
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
                </div> */}
                {/* <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-center lg:gap-x-12">
                {navigation.map((item) => (
                    <a key={item.name} href={item.href} className="font-semibold text-gray-900 hover:text-gray-900">
                    {item.name}
                    </a>
                ))}
                </div> */}
                {/* <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-end">
                <a
                    href="#"
                    className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                >
                    Log in
                </a>
                </div> */}
            </nav>

            </div>
        </div>

       
        
    );

};

export default NavBar;