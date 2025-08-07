import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import type { Material } from '@/types';
import { ContractRequestData } from '@apis/worker/ContractApi';
import { postContract } from '@apis/worker/ContractApi';
import { getMaterials } from '@apis/worker/MaterialApi';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { useLoginUserStore } from '@stores/loginUserStore';
import multiSelectBoxCustomStyles from '@styles/multiSelectBoxCustomStyles';
import { formatDateWithTime } from '@utils/formatDateWithTime';
import formatNumberWithCommas from '@utils/formatNumberWithCommas';
import { WebSocketContext } from '@utils/socket/WebSocketProvider';
import axios from 'axios';

interface ContractProps {
  closeContractModal: () => void;
  name: string;
}
interface Field {
  label: string;
  value: string;
  placeholder: string;
  type: 'input' | 'select';
  editable: boolean;
}

const base_url = 'https://zipplz.xyz/api/';

export default function Contract({ closeContractModal, name }: ContractProps) {
  const contractInfo: Field[] = [
    {
      label: '고객 이름',
      value: name,
      placeholder: '내용을 입력해주세요.',
      type: 'input',
      editable: false,
    },
    {
      label: '작업 가격',
      value: '',
      placeholder: '내용을 입력해주세요.',
      type: 'input',
      editable: true,
    },
    {
      label: '출장 주소',
      value: '',
      placeholder: '내용을 입력해주세요.',
      type: 'input',
      editable: true,
    },
    {
      label: '작업 시작일',
      value: '',
      placeholder: 'YYYY-MM-DD',
      type: 'input',
      editable: true,
    },
    {
      label: '작업 마감일',
      value: '',
      placeholder: 'YYYY-MM-DD',
      type: 'input',
      editable: true,
    },
    {
      label: '자재',
      value: '',
      placeholder: '내용을 입력해주세요.',
      type: 'select',
      editable: true,
    },
  ];

  const [fields, setFields] = useState<Field[]>(contractInfo);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { sendMessage } = useContext(WebSocketContext) || {
    sendMessage: () => {},
  };
  const { loginUser } = useLoginUserStore();
  const userSerial: number | undefined = loginUser?.userSerial;
  const userName: string | undefined = loginUser?.userName;
  const { chatroomSerial } = useParams<{
    chatroomSerial?: string | undefined;
  }>();
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await getMaterials();
        setMaterials(response.data.data);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
      }
    };

    fetchMaterials();
  }, []);

  const handlePostContract = async () => {
    if (!chatroomSerial) {
      console.error('Invalid chatroomSerial');
      return;
    }

    if (!startDate || !endDate || !fields[1].value || !fields[2].value) {
      alert('모든 양식을 채워주세요.');
      return;
    }

    const workPrice =
      Number(fields.find((field) => field.label === '작업 가격')?.value) || 0;

    const calculateTotalDuration = (
      startDate: string,
      endDate: string
    ): number => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDifference = end.getTime() - start.getTime() + 1;
      const dayDifference = timeDifference / (1000 * 3600 * 24);
      return Math.ceil(dayDifference);
    };

    const totalDuration =
      startDate && endDate ? calculateTotalDuration(startDate, endDate) : 0;

    const requestData: ContractRequestData = {
      requestComment: '계약서 초안 작성해서 보냅니다.',
      startDate,
      endDate,
      workPrice,
      materialList: selectedMaterials.map(
        (material) => material.materialSerial
      ),
      chatroomSerial: Number(chatroomSerial),
    };
    try {
      const response = await axios.get(
        `${base_url}chatroom/${chatroomSerial}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (response.status === 200 && response.data) {
        const otherUserName = response.data.data.otherUser.name;
        await postContract(Number(chatroomSerial), requestData);
        const formattedMessage = `
                ✨ 계약서 초안 작성 완료! ✨
                
    👷‍♂️ 시공자: ${userName}
    👩‍🦰 고객: ${otherUserName}
    👏 요청 일자: ${formatDateWithTime(new Date().toISOString())}
    💵 작업 가격: ${formatNumberWithCommas(workPrice)}원
    🏠 출장 주소: ${fields.find((field) => field.label === '출장 주소')?.value}
    📅 작업 기간: ${startDate}~${endDate}(${totalDuration}일)
    🛠 자재 목록: ${selectedMaterials.map((material) => material.materialName).join(', ')}
        `;
        if (sendMessage) {
          sendMessage(
            formattedMessage,
            userSerial as number,
            undefined,
            'CONTRACT',
            true
          );
        } else {
          console.error('메시지를 전송할 수 없습니다.');
        }

        closeContractModal();
      } else {
        throw new Error('Unexpected response from the server');
      }
    } catch (error) {
      console.error('계약서 초안 작성 실패:', error);
    }
  };
  const handleFieldChange = (index: number, key: 'value', value: string) => {
    const newFields = fields.map((field, i) =>
      i === index ? { ...field, [key]: value } : field
    );
    setFields(newFields);

    if (fields[index].label === '작업 시작일') {
      setStartDate(value);
    } else if (fields[index].label === '작업 마감일') {
      setEndDate(value);
    }
  };

  const handleMaterialChange = (selectedOptions: any) => {
    const selectedMaterials = selectedOptions.map((option: any) => {
      return materials.find(
        (material) => material.materialSerial === option.value
      );
    });
    setSelectedMaterials(selectedMaterials.filter(Boolean) as Material[]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handlePostContract();
  };

  const handleReset = () => {
    setFields(contractInfo);
    setSelectedMaterials([]);
    setStartDate('');
    setEndDate('');
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
      <h2 className="font-bold text-center text-zp-2xl">계약서</h2>
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
                field.label === '작업 시작일' ||
                field.label === '작업 마감일' ? (
                  <input
                    type="date"
                    value={field.value}
                    min={
                      field.label === '작업 마감일' ? startDate : getTodayDate()
                    }
                    onChange={(e) =>
                      handleFieldChange(index, 'value', e.target.value)
                    }
                    placeholder={field.placeholder}
                    className="w-full px-2 border border-zp-light-gray focus:outline-none caret-zp-main-color placeholder-zp-main-color rounded-zp-radius-btn hover:border-zp-main-color "
                    style={{
                      cursor: 'pointer',
                    }}
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
                    fontSize="sm"
                    radius="btn"
                    height={2}
                    width="full"
                    editable={!field.editable}
                  />
                )
              ) : (
                <Select
                  isMulti
                  name="materials"
                  options={(materials || []).map((material) => ({
                    value: material.materialSerial,
                    label: material.materialName,
                  }))}
                  className="w-full basic-multi-select"
                  classNamePrefix="select"
                  styles={multiSelectBoxCustomStyles}
                  value={(selectedMaterials || []).map((material) => ({
                    value: material.materialSerial,
                    label: material.materialName,
                  }))}
                  onChange={handleMaterialChange}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 pb-8">
          <Button
            type="button"
            buttonType="second"
            width="full"
            height={2.5}
            fontSize="xl"
            radius="btn"
            onClick={closeContractModal}
          >
            취소
          </Button>
          <Button
            type="button"
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
          >
            확인
          </Button>
        </div>
      </form>
    </div>
  );
}
