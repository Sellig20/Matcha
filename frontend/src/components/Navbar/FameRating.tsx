import { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import "../../assets/styles/Navbar/FameRating.css"

const FameRating = () => {

  return (
    <section className="gradient-custom">
        <div>
            <h3>Structure avec une jauge et trois rectangles alignés horizontalement</h3>
        </div>
        <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center h-100">
                {/* Grand carré */}
                <div className="col-12 col-xl-8 d-flex justify-content-center">
                    <div className="card shadow-2-strong" style={{ borderRadius: '20px', padding: '20px', height: '600px', width: '100%' }}>
                        
                        {/* Jauge horizontale */}
                        <div className="progress mb-4" style={{ height: '30px' }}>
                           
                        </div>

                        {/* Trois rectangles alignés horizontalement */}
                        <div className="fm-row row">
                            {/* Premier rectangle vertical */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h3 className="text-center">Rectangle 1</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Deuxième rectangle vertical */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h3 className="text-center">Rectangle 2</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Troisième rectangle vertical */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h3 className="text-center">Rectangle 3</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
);

};
  
  export default FameRating;