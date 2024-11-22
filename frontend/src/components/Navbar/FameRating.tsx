import { useEffect, useState } from 'react';
import axiosInstance from '../../security/axiosInstance';
import "../../assets/styles/Navbar/FameRating.css"
import { useProfile } from './User/profileContext';
import { useNavigate, useParams } from 'react-router';
import { UsersLikesCreate, UsersProfilesViewsCreate } from '../../../../backend/src/orm/schema';
import { useWebSocketContext } from '../../security/wsContext';

const FameRating = () => {

    const [message, setMessage] = useState('');
    const profile = useProfile();
    const { idd } = useParams<{idd:string}>();
    const [countViews, setCountViews] = useState<number>();
    const [countLikes, setCountLikes] = useState<number>();
    const [views, setViews] = useState<UsersProfilesViewsCreate[]>([]);
    const [likes, setLikes] = useState<UsersLikesCreate[]>([]);
    const { socket } = useWebSocketContext();
    const navigate = useNavigate();
    const { isProfileComplete } = useProfile();
    const [notification, setNotification] = useState<string | null>(null);

    const getWhoViewedMe = async () => {
        console.log("\n\n get who viewed me\n\n");
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/views/${idd}`);
            setMessage(response.data.message);
            console.log("\n\n message FM is : ", message, " and tab is : ", response.data.ProfilesViewsTab);

            setViews(response.data.ProfilesViewsTab || []);
            setCountViews(response.data.count);
        } catch (error) {
            setMessage(`FameRating.tsx | Erreur try to get who viewed me : ${error}`);
            console.log("\n\n message FM is : ", message);
        }
    };

    const getWhoLikedMe = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:8000/apiServeur/likes/${idd}`);
            setMessage(response.data.message);
            console.log("\n\n message FM is : ", message);
            setLikes(response.data.ProfilesLikesTab || []);
            setCountLikes(response.data.count);
        } catch (error) {
            setMessage(`FameRating.tsx | Erreur try to get who liked me : ${error}`);
            console.log("\n\n message FM is : ", message);
        }
    };

    const handleNavigateNotification = () => {
        setNotification(null);
    };

    useEffect(() => {

        const executeData = async () => {
            try {
                if (isProfileComplete === false) {
                    setNotification("Warning : You must fill your profile before going on");
                }
                else {
                    getWhoViewedMe();
                    getWhoLikedMe();
                    if (socket) {
                        socket.on('insert_view', (newView) => {
                            console.log("\n\n ---**--**---- new view fame rating : ", newView);
                            setViews((prevViews) => [...prevViews, newView]);
                        })
            
                        socket.on('insert_likes', (newLike) => {
                            setLikes((prevLikes) => [...prevLikes, newLike]);
                        })
            
                        socket.on('insert_name', (newName) => {
                            setViews((prevNames) => [...prevNames, newName]);
                        })
            
                        socket.on('update_countViews', (newCount) => {
                            console.log("\n\n nombre de vues get who viewed me : ", newCount);
                            setCountViews(newCount);
                        })
            
                        socket.on('update_countLikes', (newCount) => {
                            console.log("\n\n nombre de vues get who viewed me : ", newCount);
                            setCountLikes(newCount);
                        })
                    };
                }
            } catch (error) {
                setMessage(`UserProduct.tsx | Erreur use effect : ${error}`);
            }
        }
        executeData();

        return () => {
            socket?.off('insert_view');
        };
        
    }, []);

  return (
    <section className="gradient-custom">

        <div>
            {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>

        {notification && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <p>{notification}</p>
                    <button className="btn-userproduct" onClick={handleNavigateNotification}>OK</button>
                </div>
            </div>
        )}

        <div>
        </div>
        <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center h-100">
                {/* Grand carré */}
                <div className="col-12 col-xl-80 d-flex justify-content-center">
                    <div className="card shadow-2-strong" style={{ borderRadius: '20px', padding: '20px', height: '100%', width: '100%' }}>
                        
                        {/* Jauge horizontale */}
                        <div className="progress mb-4" style={{ height: '30px' }}>
                           jauge de famreting
                        </div>

                        {/* Trois rectangles alignés horizontalement */}
                        <div className="fm-row row">
                            {/* Premier rectangle vertical */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card-fm card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                    <h2 className="text-center">My number of views : {countViews}</h2>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <table className="table-fm">
                                            <thead>
                                                <tr>
                                                    {/* <th className="th-fm">INDEX</th> */}
                                                    <th className="th-fm">WHO ?</th>
                                                    <th className="th-fm">WHEN ?</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {views.map((views, index) => (
                                                    <tr key={index}>
                                                        {/* <td className="td-fm">{index + 1}</td> */}
                                                        <td className="td-fm">{views.first_name}</td>
                                                        <td className="td-fm">{new Date(views.view_started_on).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Deuxième rectangle vertical */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card-fm card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                    <h2 className="text-center">My number of likes : {countLikes}</h2>
                                        <div className="card-body d-flex align-items-center justify-content-center">
                                        <table className="table-fm">
                                            <thead>
                                                <tr>
                                                    <th className="th-fm">WHO ?</th>
                                                    <th className="th-fm">WHEN ?</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {likes.map((likes, index) => (
                                                    <tr key={index}>
                                                        <td className="td-fm">{likes.first_name}</td>
                                                        <td className="td-fm">{new Date(likes.liked_on).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Troisième rectangle vertical */}
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                <div className="card-fm card shadow-2-strong" style={{ borderRadius: '20px', width: '100%', height: '100%' }}>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <h2 className="text-center">My number of matchs</h2>
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