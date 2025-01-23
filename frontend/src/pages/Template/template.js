import { useNavigate } from 'react-router-dom';
import '../../css/Template.css'; // Add your styling here

export default function PageLayout({ children, bgColor = '#f5f5f5' }) {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div className="page-layout" style={{ backgroundColor: bgColor }}>
            <div className="page-header">
                <button className="back-button" onClick={handleBack}>
                    ← Back
                </button>
            </div>
            <div className="page-content">
                {children} {/* Render the page's specific content */}
            </div>
        </div>
    );
}
