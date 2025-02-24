import { ChangeEvent, useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { GoArrowLeft } from 'react-icons/go';
import { MdClose } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { useQuestionPostStore } from '@stores/QuestionPostStore';

export default function QuestionPostCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState<string>('');
  const [workDetail, setWorkDetail] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [postId, setPostId] = useState<number | null>(null);

  const { createPost, updatePost } = useQuestionPostStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const maxImages = 10;

  useEffect(() => {
    if (location.state) {
      const { post, isEditMode } = location.state;
      setTitle(post.title);
      setWorkDetail(post.board_content);
      setImages(post.images || []);
      setIsEditMode(isEditMode);
      setPostId(post.board_serial);
    }
  }, [location.state]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.slice(0, maxImages - images.length);

    setImages((prevImages) => [...prevImages, ...validFiles]);
  };

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!title) newErrors.title = '제목이 입력되지 않았습니다';
    if (!workDetail) newErrors.workDetail = '질문 내용이 입력되지 않았습니다';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = `Bearer ${localStorage.getItem('token')}`;
    const formData = new FormData();

    formData.append('title', title);
    formData.append('board_content', workDetail);

    if (images.length === 0) {
      formData.append('images', 'null');
    } else {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    try {
      let response;
      if (isEditMode && postId) {
        response = await updatePost(token, postId, formData);
      } else {
        response = await createPost(token, formData);
      }

      const { code, message } = response;
      if (code === 200) {
        alert(
          isEditMode
            ? '질문글이 성공적으로 수정되었습니다.'
            : '질문글이 성공적으로 등록되었습니다.'
        );
        navigate('/QuestionPost');
      } else {
        alert(`질문글 처리에 실패했습니다: ${message}`);
      }
    } catch (error) {
      console.error('Failed to create/update post:', error);
      alert('오류가 발생했습니다. 나중에 다시 시도해 주세요.');
    }
  };

  const handleGoBack = () => {
    navigate('/QuestionPost');
  };

  return (
    <>
      <div className="flex justify-center items-start min-h-screen p-6 bg-gray-100">
        <div className="w-full">
          <div className="mt-12 flex items-center justify-between w-full">
            <div className="flex items-center">
              <GoArrowLeft
                className="mr-6 cursor-pointer"
                onClick={handleGoBack}
              />
            </div>
            <div className="relative right-4 text-zp-xl font-bold text-center flex-1">
              질문하기
            </div>
          </div>

          <div className="mt-6 font-bold flex items-center justify-start">
            <div className="text-left text-zp-xs">
              <div>현장이나 일과 관련된 사진을 올려주세요.(선택사항)</div>
              <div className="text-zp-2xs text-zp-light-gray">
                사진을 첨부하면 질문에 대한 보다 상세한 답변을 받을 수 있어요.
              </div>
            </div>
          </div>

          <div className="flex items-start mt-6 space-x-4">
            <div className="w-1/6">
              <div className="relative">
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-20 h-20 bg-zp-white border border-zp-main-color rounded-zp-radius-btn p-2 cursor-pointer"
                >
                  <FaCamera size={24} className="" />
                  <div className="w-full flex justify-center absolute bottom-2 font-bold text-zp-xs text-zp-gray">
                    {images.length}/{maxImages}
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                />
              </div>
            </div>

            <div className="flex-1 flex overflow-x-auto space-x-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 flex-shrink-0 ${
                    index === 0 ? 'ml-6' : ''
                  }`}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded-zp-radius-btn"
                  />

                  <button
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <MdClose size={24} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 font-bold flex flex-col items-center justify-center">
            <div className="text-left w-full">
              <div className="mb-2">제목</div>
              <div className="bg-zp-white border rounded-zp-radius-btn">
                <Input
                  type="text"
                  placeholder="제목 입력"
                  inputType="textArea"
                  width="100%"
                  height={2.375}
                  className=""
                  fontSize="xs"
                  radius="btn"
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  }
                />
              </div>
              {errors.title && (
                <div className="text-zp-red text-zp-xs mt-1">
                  {errors.title}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 font-bold flex flex-col items-center justify-center">
            <div className="text-left w-full">
              <div className="mb-2">질문</div>
              <div className="bg-zp-white border rounded-zp-radius-btn">
                <Input
                  type="text"
                  placeholder="질문 내용을 입력하세요."
                  inputType="textArea"
                  width="100%"
                  height={15}
                  className=""
                  fontSize="xs"
                  radius="btn"
                  value={workDetail}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setWorkDetail(e.target.value)
                  }
                />
              </div>
              {errors.workDetail && (
                <div className="text-zp-red text-zp-xs mt-1">
                  {errors.workDetail}
                </div>
              )}
            </div>
          </div>

          <div className="mb-12 mt-6 font-bold h-20 flex items-center justify-center">
            <Button
              children={isEditMode ? '수정하기' : '작성하기'}
              buttonType="second"
              width="full"
              height={2.375}
              fontSize="xl"
              radius="btn"
              onClick={handleConfirm}
            />
          </div>
        </div>
      </div>
    </>
  );
}
