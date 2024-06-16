import { AiOutlineAim, AiOutlineBook, AiOutlineExclamationCircle, AiOutlineGlobal, AiOutlineHeart, AiOutlineHome, AiOutlineStar, AiOutlineTags, AiOutlineUser } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';

import { updateCurrentUser } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import { useNotification } from '../hooks/useNotification';
import { z } from 'zod';

const stepSchemas = [
  z.object({
    fullName: z.string().nonempty({ message: 'Full Name is required' }),
    nativeLanguage: z.string().nonempty({ message: 'Native Language is required' }),
    location: z.string().nonempty({ message: 'Location is required' }),
  }),
  z.object({
    portugueseLevel: z.string().nonempty({ message: 'Portuguese Level is required' }),
    learningPurpose: z.string().nonempty({ message: 'Learning Purpose is required' }),
    preferredLearningStyle: z.string().nonempty({ message: 'Preferred Learning Style is required' }),
  }),
  z.object({
    specificGoals: z.string().nonempty({ message: 'Specific Goals are required' }),
    interests: z.string().nonempty({ message: 'Interests are required' }),
    topicsOfInterest: z.string().nonempty({ message: 'Topics of Interest are required' }),
    specialRequirements: z.string().optional(),
  }),
];

const steps = [
  {
    title: 'Personal Information',
    icon: <AiOutlineUser />,
    questions: [
      { label: 'Full Name', key: 'fullName', placeholder: 'Enter your full name', icon: <AiOutlineUser /> },
      {
        label: 'Native Language',
        key: 'nativeLanguage',
        placeholder: 'Enter your native language',
        icon: <AiOutlineGlobal />,
      },
      { label: 'Location', key: 'location', placeholder: 'Enter your location', icon: <AiOutlineHome /> },
    ],
  },
  {
    title: 'Learning Preferences',
    icon: <AiOutlineBook />,
    questions: [
      {
        label: 'Portuguese Level',
        key: 'portugueseLevel',
        placeholder: 'Enter your Portuguese level',
        icon: <AiOutlineBook />,
      },
      {
        label: 'Learning Purpose',
        key: 'learningPurpose',
        placeholder: 'Enter your learning purpose',
        icon: <AiOutlineAim />,
      },
      {
        label: 'Preferred Learning Style',
        key: 'preferredLearningStyle',
        placeholder: 'Enter your preferred learning style',
        icon: <AiOutlineHeart />,
      },
    ],
  },
  {
    title: 'Interests and Goals',
    icon: <AiOutlineStar />,
    questions: [
      {
        label: 'Specific Goals',
        key: 'specificGoals',
        placeholder: 'Enter your specific goals',
        icon: <AiOutlineAim />,
      },
      { label: 'Interests', key: 'interests', placeholder: 'Enter your interests', icon: <AiOutlineHeart /> },
      {
        label: 'Topics of Interest',
        key: 'topicsOfInterest',
        placeholder: 'Enter your topics of interest',
        icon: <AiOutlineTags />,
      },
      {
        label: 'Special requirements',
        key: 'specialRequirements',
        placeholder: 'Enter any special requirements',
        icon: <AiOutlineExclamationCircle />,
      },
    ],
  },
];

const LearningProfilePage = () => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { data: user } = useAuth();
  const addNotification = useNotification();

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName ?? '',
        nativeLanguage: user.nativeLanguage ?? '',
        location: user.location ?? '',
        portugueseLevel: user.portugueseLevel ?? '',
        learningPurpose: user.learningPurpose ?? '',
        preferredLearningStyle: user.preferredLearningStyle ?? '',
        specificGoals: user.specificGoals ?? '',
        interests: user.interests ?? '',
        topicsOfInterest: user.topicsOfInterest ?? '',
        specialRequirements: user.specialRequirements ?? '',
      });
    }
  }, [user]);

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const validateForm = () => {
    try {
      stepSchemas.forEach((schema) => schema.parse(formData));
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        e.errors.forEach((error) => {
          if (error.path.length > 0) {
            const fieldKey = error.path[0] as string;
            fieldErrors[fieldKey] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await updateCurrentUser(formData);
        addNotification({
          title: 'Learning profile successfully updated!',
          description: 'Your changes have been saved.',
          variant: 'success',
          duration: 5000, // Automatically dismiss after 5 seconds
        });
      } catch (error) {
        console.error(error);
        alert('Failed to update profile.');
      }
    } else {
      alert('Please fill out all required fields.');
    }
  };

  return (
    <div className='mt-10 px-6 h-full py-20'>
      <form onSubmit={handleSubmit}>
        <div className='overflow-hidden border border-gray-900/10 shadow-lg sm:rounded-lg lg:m-8 dark:border-gray-100/10'>
          <div className='flex items-center px-4 py-5 sm:px-6 lg:px-8'>
            <h2 className='text-lg leading-6 font-medium text-gray-900 dark:text-white'>Learning Profile</h2>
          </div>
          <div className='border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-5 sm:p-0'>
            <dl className='sm:divide-y sm:divide-gray-900/10 sm:dark:divide-gray-100/10'>
              {steps
                .flatMap((step) => step.questions)
                .map((question) => (
                  <div key={question.key} className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                    <dt className='text-sm font-medium text-gray-500 dark:text-white'>{question.label}</dt>
                    <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                          {question.icon}
                        </div>
                        <input
                          type='text'
                          value={formData[question.key] || ''}
                          onChange={(e) => handleChange(question.key, e.target.value)}
                          placeholder={question.placeholder}
                          className={`w-full pl-10 rounded-md border ${
                            errors[question.key]
                              ? 'border-red-500'
                              : 'border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                          }`}
                        />
                      </div>
                      {errors[question.key] && <p className='text-red-500 text-xs mt-1'>{errors[question.key]}</p>}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
          <div className='px-4 py-5 sm:px-6 lg:px-8 flex justify-end'>
            <button
              type='submit'
              className='inline-flex justify-center py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Update Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LearningProfilePage;
