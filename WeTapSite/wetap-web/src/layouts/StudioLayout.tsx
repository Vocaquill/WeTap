import BaseLayout from './BaseLayout';
import StudioSidebar from '../components/layout/StudioSidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function StudioLayout() {
    return (
        <BaseLayout
            sidebar={({isOpen, toggleSidebar}) => (
                <StudioSidebar isOpen={isOpen} toggleSidebar={toggleSidebar}/>
            )}
            header={<Header/>}
            footer={<Footer/>}
        />
    );
}

export default StudioLayout;
