import React from 'react';
import './style.css';
import MedicalCenter from '../Assets/med_centre.png';
import Ministry from '../Assets/ministry.png';


const Resource = () => {
    return (
        <>
        <hr />
        <div className="resource-container">
            <h1 className="resource-title">Additional Resources</h1>
            <p className="resource-description">
                Here are some additional resources that may be helpful for your mental wellness journey:
            </p>
            <div className="resource-cards">

                <div className="resource-card">
                    <div className="card-text-content">
                        <h3 className="card-title">University
                            of Technology, Jamaica Counseling Services</h3>
                        <p className="card-description">
                            Most universities offer free counseling services to students. Check your university's website for more information on how to access these services.
                        </p>
                    </div>
                    <img src={MedicalCenter} alt="Counseling Services" className="card-image" />
                </div>

                <div className="resource-card">
                    <div className="card-text-content">
                        <h3 className="card-title">Ministry of Health</h3>
                        <p className="card-description">
                            The Ministry of Health provides information and resources for mental health support in your community.
                        </p>
                    </div>
                    <img src={Ministry} alt="Ministry of Health" className="card-image" />
                </div>

                <div className="resource-card">
                    <div className="card-text-content">
                        <h3 className="card-title">Online Support Communities</h3>
                        <p className="card-description">
                            Websites like 7 Cups and Reddit's r/mentalhealth offer online communities where you can connect with others who may be experiencing similar challenges.
                        </p>
                    </div>
                    <img src={"../Assests/support_communities.png"} alt="Support Communities" className="card-image" />
                </div>

            </div>
        </div></>
    );
};

export default Resource;