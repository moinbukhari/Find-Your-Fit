import Image from 'next/image';
import appLogo from '../assets/logo1.png';

const NavBar = () => {

    return(
        
        <div className="px-6 pt-6 lg:px-8 mb-6">
            <div>
            <nav className="flex h-9 items-center justify-between" aria-label="Global">
                <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                <a href="/" className="flex -m-1.5 p-1.5 text-center ">
                    
                    <Image className="h-12 w-12 rounded-full mr-1" src={appLogo} alt="" />
                    <span className="font-mono tracking-tighter font-bold text-lg flex items-center text-left ">Find Your Fit</span>
                </a>
                </div>
            </nav>

            </div>
        </div>

       
        
    );

};

export default NavBar;