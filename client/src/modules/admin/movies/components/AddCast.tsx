'use client'
import React, { useState, useEffect } from 'react';
import { CastMember } from '../types/types';

interface AddCastProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCast: (castMembers: CastMember[]) => void;
  initialCast?: CastMember[] | null;
}

interface CastError {
  name: boolean;
  photo: boolean;
}

const MAX_CAST_MEMBERS = 5;

const AddCast: React.FC<AddCastProps> = ({ isOpen, onClose, onAddCast, initialCast }) => {
  const [castMembers, setCastMembers] = useState<CastMember[]>([{ castName: '', castPhoto: null }]);
  const [errors, setErrors] = useState<CastError[]>([{ name: false, photo: false }]);
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([null]);

  useEffect(() => {
    if (isOpen) {
      if (initialCast && initialCast.length > 0) {
        setCastMembers(initialCast);
        setErrors(initialCast.map(() => ({ name: false, photo: false })));
        setPhotoPreviews(initialCast.map(member => 
          typeof member.castPhoto === 'string' ? `http://localhost:5000${member.castPhoto}` : null
        ));
      } else {
        setCastMembers([{ castName: '', castPhoto: null }]);
        setErrors([{ name: false, photo: false }]);
        setPhotoPreviews([null]);
      }
    }
  }, [isOpen, initialCast]);

  const handleAddMember = () => {
    if (castMembers.length < MAX_CAST_MEMBERS) {
      setCastMembers([...castMembers, { castName: '', castPhoto: null }]);
      setErrors([...errors, { name: false, photo: false }]);
      setPhotoPreviews([...photoPreviews, null]);
    }
  };

  const handleChange = (index: number, field: 'castName' | 'castPhoto', value: string | File | null) => {
    if (field === 'castName') errors[index].name = false;
    if (field === 'castPhoto') {
      errors[index].photo = false;
      if (value instanceof File) {
        const newPreviews = [...photoPreviews];
        newPreviews[index] = URL.createObjectURL(value);
        setPhotoPreviews(newPreviews);
      }
    }
  
    const updatedCastMembers = castMembers.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    setCastMembers(updatedCastMembers);
  };

  const handleRemoveMember = (index: number) => {
    const updatedCastMembers = castMembers.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    const updatedPreviews = photoPreviews.filter((_, i) => i !== index);
    setCastMembers(updatedCastMembers.length > 0 ? updatedCastMembers : [{ castName: '', castPhoto: null }]);
    setErrors(updatedErrors.length > 0 ? updatedErrors : [{ name: false, photo: false }]);
    setPhotoPreviews(updatedPreviews.length > 0 ? updatedPreviews : [null]);
  };

  const handleSubmit = () => {  
    const newErrors: CastError[] = castMembers.map(member => ({
      name: member.castName.trim() === '',
      photo: member.castPhoto === null
    }));

    setErrors(newErrors);

    if (newErrors.every(error => !error.name && !error.photo)) {
      onAddCast(castMembers);
      onClose();
    }
  }; 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md flex flex-col max-h-[90vh]">
        <h2 className="text-xl font-bold p-4 border-b">
          {initialCast ? 'Edit Cast Members' : 'Add Cast Members'}
        </h2>
        <div className="overflow-y-auto flex-grow p-4">
          {castMembers.map((member, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                placeholder="Cast Member Name"
                value={member.castName}
                onChange={(e) => handleChange(index, 'castName', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              {errors[index]?.name && (
                <p className="text-red-500 text-sm mb-2">Please enter the name of artist</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange(index, 'castPhoto', e.target.files?.[0] || null)}
                className="w-full p-2 border rounded mb-2"
              />
              {errors[index]?.photo && (
                <p className="text-red-500 text-sm mb-2">Please select a photo</p>
              )}
              {photoPreviews[index] && (
                <img src={photoPreviews[index] || ''} alt={`Cast member ${index + 1}`} className="mt-2 w-20 h-20 object-cover" />
              )}
              {index > 0 && (
                <button
                  onClick={() => handleRemoveMember(index)}
                  className="mt-2 text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="border-t p-4 flex justify-between items-center">
          <button
            onClick={handleAddMember}
            disabled={castMembers.length >= MAX_CAST_MEMBERS}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:bg-blue-300"
          >
            Add Member
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
          >
            Save Cast
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCast;