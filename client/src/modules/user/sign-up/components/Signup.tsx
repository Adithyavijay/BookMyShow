import React, { useRef, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { signupModalState } from '@/atoms/modalAtom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import OtpInput from 'react-otp-input';
import toast, { Toaster } from 'react-hot-toast';
import ClipLoader from "react-spinners/ClipLoader";

axios.defaults.withCredentials = true;

const GoogleAuthModal: React.FC = () => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useRecoilState(signupModalState);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const api = process.env.API_BASE_URL;
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowModal]);

    const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        console.log('Google Sign-In Successful:', credentialResponse);
        if (credentialResponse.credential) {
            setLoading(true);
            try {
                const response = await axios.post(`${api}/admin/auth/google-callback`, {
                    credential: credentialResponse.credential
                });
                console.log(response.data)
                if (response.data.user.requireTwoFactorAuth) {
                    localStorage.setItem('userInfo', response.data.user);
                    setShowOtpInput(true); 
                    toast.success('OTP sent to your email!');
                } else {
                    setShowModal(false);
                }
            } catch (err) {
                console.error(err);
                toast.error('An error occurred during authentication.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGoogleLoginError = () => {
        console.log('Google Sign-In Failed');
        toast.error('Google Sign-In failed. Please try again.');
    };

    const handleOtpSubmit = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.post(`${api}/admin/auth/verify-otp`, {
                userId,
                otp
            });
            toast.success('OTP verified successfully!');
            setShowModal(false);
            router.push('/'); // Adjust this route as needed
        } catch (err) {
            console.error(err);
            toast.error('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-lg p-8 max-w-md w-full transform animate-slideIn">
                <Toaster position="top-center" reverseOrder={false} />
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <ClipLoader color="#4A90E2" loading={loading} size={50} />
                    </div>
                ) : !showOtpInput ? (
                    <>
                        <h2 className="text-2xl font-bold mb-6 text-center">Sign In with Google</h2>
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={handleGoogleLoginError}
                                useOneTap
                            />
                        </div>
                        <p className="mt-4 text-sm text-gray-600 text-center">
                            By signing in, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span className="mx-1">-</span>}
                            renderInput={(props) => <input {...props} className="w-40 h-10 text-center border border-gray-300 rounded" style={{width:'2.5rem'}}/>}
                            inputStyle="inputStyle"
                        />
                        <button
                            onClick={handleOtpSubmit}
                            className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Verify OTP
                        </button>
                    </>
                )}
                {!loading && (
                    <button 
                        onClick={() => setShowModal(false)}
                        className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition duration-300"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default GoogleAuthModal;