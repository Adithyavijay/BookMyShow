import React, { useRef, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { signupModalState } from "@/atoms/modalAtom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import OtpInput from "react-otp-input";
import toast, { Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { userState } from "@/atoms/modalAtom";

axios.defaults.withCredentials = true;

const GoogleAuthModal: React.FC = () => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useRecoilState(signupModalState);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [, setUser] = useRecoilState(userState);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState("");
    const api = process.env.API_BASE_URL;
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setShowModal]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (showOtpInput && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [showOtpInput, timer]);

    const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        console.log("Google Sign-In Successful:", credentialResponse);
        if (credentialResponse.credential) {
            setLoading(true);
            try {
                const response = await axios.post(`${api}/user/auth/google-callback`, {
                    credential: credentialResponse.credential,
                });
                console.log(response.data);
                if (response.data.user.requireTwoFactorAuth) {
                    setShowOtpInput(true);
                    setCurrentUserEmail(response.data.user.email);
                    toast.success("OTP sent to your email!");
                    setTimer(30);
                    setCanResend(false);
                } else {
                    setShowModal(false);
                }
            } catch (err) {
                console.error(err);
                toast.error("An error occurred during authentication.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGoogleLoginError = () => {
        console.log("Google Sign-In Failed");
        toast.error("Google Sign-In failed. Please try again.");
    };

    const handleOtpSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${api}/user/auth/verify-otp`, {
                otp,
            });
            console.log("after otp submit : ", response.data);
            setUser(response.data.user);
            toast.success("OTP verified successfully!");
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            setShowModal(false);
        } catch (err) {
            console.error(err);
            toast.error("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${api}/user/auth/google-callback`, {
                resendOTP: true
            });
            toast.success("New OTP sent to your email!");
            setTimer(30);
            setCanResend(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return !showModal ? (
        <></>
    ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-lg p-8 max-w-md w-full transform animate-slideIn shadow-xl"
            >
                <Toaster position="top-center" reverseOrder={false} />
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <ClipLoader color="#4A90E2" loading={loading} size={50} />
                    </div>
                ) : !showOtpInput ? (
                    <>
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                            Sign In with Google
                        </h2>
                        <div className="flex justify-center mb-6">
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={handleGoogleLoginError}
                                useOneTap
                            />
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            By signing in, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                            Enter OTP
                        </h2>
                        <p className="text-sm text-gray-600 text-center mb-4">
                            An OTP has been sent to {currentUserEmail}
                        </p>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={(props) => (
                                <input 
                                    {...props} 
                                    style={{
                                        width: '3rem',
                                        height: '3rem',
                                        margin: '0 0.5rem',
                                        fontSize: '1.5rem',
                                        borderRadius: '0.5rem',
                                        border: '2px solid #d1d5db',
                                        textAlign: 'center',
                                        fontWeight: '600',
                                    }}
                                    className="focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            )}
                            containerStyle="display: flex; justify-content: center; max-width: 400px; margin: 0 auto;"
                        />
                        <div className="mt-4 text-center">
                            {canResend ? (
                                <button
                                    onClick={handleResendOtp}
                                    className="text-blue-500 hover:text-blue-700 transition duration-300"
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <p className="text-gray-500">
                                    Resend OTP in {timer} seconds
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleOtpSubmit}
                            className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold text-lg"
                        >
                            Verify OTP
                        </button>
                    </>
                )}
                {!loading && (
                    <button
                        onClick={() => setShowModal(false)}
                        className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition duration-300 w-full text-center"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default GoogleAuthModal;