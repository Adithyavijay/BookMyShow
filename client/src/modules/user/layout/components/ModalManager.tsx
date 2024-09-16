'use client'
import React from 'react';
import { useRecoilValue } from 'recoil';
import { signupModalState } from '@/atoms/modalAtom';
import GoogleAuthModal from '@/modules/user/sign-up/components/Signup';

function ModalManager() {
  const showModal = useRecoilValue(signupModalState);
  
  return (
    <>
      {showModal && <GoogleAuthModal />}
    </>
  );
}

export default ModalManager;