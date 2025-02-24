import { ChangeEvent, useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { GoArrowLeft } from 'react-icons/go';
import { MdClose } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { useQuestionPostStore } from '@stores/QuestionPostStore';
import { AxiosError } from 'axios';

export default function QuestionPostUpdate() {
  type Image = File | string;
  const [images, setImages] = useState<Image[]>([]);
  const [title, setTitle] = useState<string>('');
  const [boardContent, setBoardContent] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [postId, setPostId] = useState<number | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const maxImages = 10;

  const { updatePost, createPost, fetchPostDetails, postDetails } =
    useQuestionPostStore();

  useEffect(() => {
    if (location.state) {
      const { post, isEditMode } = location.state;
      setTitle(post.title || '');
      setBoardContent(post.board_content || '');
      setImages(post.images.map((img: any) => img.saveFile) || []);
      setIsEditMode(isEditMode);
      setPostId(post.board_serial);
    }
  }, [location.state]);

  useEffect(() => {
    if (isEditMode && postId) {
      fetchPostDetails(postId);
    }
  }, [isEditMode, postId, fetchPostDetails]);

  useEffect(() => {
    if (postDetails) {
      setTitle(postDetails.title);
      setBoardContent(postDetails.boardContent);
      setImages(postDetails.images.map((img) => img.saveFile));
    }
  }, [postDetails]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages((prevImages) => [
      ...prevImages,
      ...files.slice(0, maxImages - prevImages.length),
    ]);
  };

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!title) newErrors.title = '제목이 입력되지 않았습니다';
    if (!boardContent)
      newErrors.boardContent = '질문 내용이 입력되지 않았습니다';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      if (isEditMode && postId) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('board_content', boardContent);

        images.forEach((image) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });

        const { code, message } = await updatePost(token, postId, formData);
        if (code === 200) {
          alert('질문글이 성공적으로 수정되었습니다.');
          navigate('/QuestionPost');
        } else {
          alert(`질문글 수정에 실패했습니다: ${message}`);
        }
      } else {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('board_content', boardContent);

        if (images.length > 0) {
          images.forEach((image) => {
            if (image instanceof File) {
              formData.append('images', image);
            }
          });
        } else {
          formData.append('images', new Blob());
        }

        const { code, message } = await createPost(token, formData);
        if (code === 200) {
          alert('질문글이 성공적으로 등록되었습니다.');
          navigate('/QuestionPost');
        } else {
          alert(`질문글 등록에 실패했습니다: ${message}`);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Failed to create/update post:', error);
        console.error('Response data:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
      alert('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handleGoBack = () => {
    navigate('/QuestionPost');
  };

  return (
    <div className="flex items-start justify-center min-h-screen p-6">
      <div className="w-full">
        <div className="flex items-center justify-between w-full mt-12">
          <div className="flex items-center">
            <GoArrowLeft
              className="mr-6 cursor-pointer"
              onClick={handleGoBack}
            />
          </div>
          <div className="relative flex-1 font-bold text-center right-4 text-zp-2xl">
            {isEditMode ? '질문 수정하기' : '질문 작성하기'}
          </div>
        </div>

        <div className="flex items-center justify-start mt-6 font-bold">
          <div className="text-left">
            <div>질문과 관련된 사진을 올려주세요.(선택사항)</div>
            <div className="text-zp-xs text-zp-light-gray">
              사진을 첨부하면 질문에 대해 보다 상세한 답변을 받을 수 있어요.
            </div>
          </div>
        </div>

        <div className="flex items-start mt-6 space-x-4">
          <div className="w-1/6">
            <div className="relative">
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-24 h-24 p-2 border cursor-pointer bg-zp-white border-zp-light-gray rounded-zp-radius-btn"
              >
                <FaCamera size={36} className="" />
                <div className="absolute flex justify-center w-full font-bold bottom-2 text-zp-xs text-zp-gray">
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
          <div className="flex flex-1 space-x-4 overflow-x-auto">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative w-24 h-24 flex-shrink-0 ${
                  index === 0 ? 'ml-4' : ''
                }`}
              >
                <img
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
                  alt={`Preview ${index}`}
                  className="object-cover w-full h-full rounded-zp-radius-btn"
                />
                <button
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                >
                  <MdClose size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-6 font-bold">
          <div className="w-full text-left">
            <div className="mb-2">제목</div>
            <div className="pl-2 border bg-zp-white border-zp-light-gray rounded-zp-radius-btn">
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
              <div className="mt-1 text-zp-red text-zp-xs">{errors.title}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-6 font-bold">
          <div className="w-full text-left">
            <div className="mb-2">질문 내용</div>
            <div className="pl-2 border bg-zp-white border-zp-light-gray rounded-zp-radius-btn">
              <Input
                type="text"
                placeholder="질문 내용을 입력하세요."
                inputType="textArea"
                width="100%"
                height={10}
                className=""
                fontSize="xs"
                radius="btn"
                value={boardContent}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setBoardContent(e.target.value)
                }
              />
            </div>
            {errors.boardContent && (
              <div className="mt-1 text-zp-red text-zp-xs">
                {errors.boardContent}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center h-20 mt-6 mb-12 font-bold">
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
  );
}
