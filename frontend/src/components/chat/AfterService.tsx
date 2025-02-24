import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { postAfterService } from '@apis/worker/AfterServiceApi';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import TextArea from '@components/common/TextArea';

interface AfterServiceProps {
  closeAfterServiceModal: () => void;
  name: string | undefined;
  submit: boolean;
  setSubmit: (isSubmit: boolean) => void;
}

interface Field {
  label: string;
  value: string;
  placeholder: string;
  type: 'input' | 'textarea';
}

export default function AfterService({
  closeAfterServiceModal,
  name,
  submit,
  setSubmit,
}: AfterServiceProps) {
  const defaultFields: Field[] = [
    {
      label: '시작 날짜',
      value: '',
      placeholder: 'YYYY-MM-DD',
      type: 'input',
    },
    {
      label: '종료 날짜',
      value: '',
      placeholder: 'YYYY-MM-DD',
      type: 'input',
    },
    {
      label: '희망 가격',
      value: '',
      placeholder: '숫자만 입력하세요.',
      type: 'input',
    },
    {
      label: '메모',
      value: '',
      placeholder: '시공업자에게 요청 사항을 적어주세요.',
      type: 'textarea',
    },
  ];

  const [fields, setFields] = useState<Field[]>(defaultFields);
  const { chatroomSerial } = useParams<{ chatroomSerial?: string }>();

  const handleFieldChange = (index: number, key: 'value', value: string) => {
    const newFields = fields.map((field, i) =>
      i === index ? { ...field, [key]: value } : field
    );
    setFields(newFields);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmit(true);

    const memoField = fields.find((field) => field.label === '메모');
    const requestContent = memoField ? memoField.value : '';

    try {
      if (chatroomSerial) {
        await postAfterService(Number(chatroomSerial), { requestContent });
        closeAfterServiceModal();
      } else {
        console.error('chatroomSerial is missing');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmit(false);
    }
  };

  const handleReset = () => {
    setFields(defaultFields);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-full p-4 bg-zp-white">
      <h2 className="font-bold text-center text-zp-xl">
        {name}님께 A/S작업을 요청하세요.
      </h2>
      <form
        className="flex flex-col justify-between h-full pt-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-start">
          {fields.map((field, index) => (
            <div key={field.label} className="flex items-center mb-2 gap-x-3">
              <label className="w-24 break-keep text-zp-xs">
                {field.label}
              </label>
              {field.type === 'input' ? (
                field.label === '시작 날짜' || field.label === '종료 날짜' ? (
                  <input
                    type="date"
                    value={field.value}
                    min={
                      field.label === '종료 날짜'
                        ? fields.find((f) => f.label === '시작 날짜')?.value ||
                          getTodayDate()
                        : getTodayDate()
                    }
                    onChange={(e) =>
                      handleFieldChange(index, 'value', e.target.value)
                    }
                    placeholder={field.placeholder}
                    className="w-full px-2 border border-zp-light-gray focus:outline-none caret-zp-main-color placeholder-zp-main-color rounded-zp-radius-btn hover:border-zp-main-color"
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <Input
                    type="text"
                    inputType="normal"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) =>
                      handleFieldChange(index, 'value', e.target.value)
                    }
                    width="full"
                    height={2}
                    fontSize="sm"
                    radius="btn"
                  />
                )
              ) : (
                <TextArea
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) =>
                    handleFieldChange(index, 'value', e.target.value)
                  }
                  width="full"
                  height={12}
                  fontSize="sm"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 pb-8 mt-4">
          <Button
            type="button"
            buttonType="second"
            width="full"
            height={2.5}
            fontSize="xl"
            radius="btn"
            onClick={closeAfterServiceModal}
          >
            취소
          </Button>
          <Button
            type="reset"
            buttonType="normal"
            width="full"
            height={2.5}
            fontSize="xl"
            radius="btn"
            onClick={handleReset}
          >
            초기화
          </Button>
          <Button
            type="submit"
            buttonType="primary"
            width="full"
            height={2.5}
            fontSize="xl"
            radius="btn"
            disabled={submit}
          >
            확인
          </Button>
        </div>
      </form>
    </div>
  );
}
