import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setModel } from '../../store/chatSlice';
import { Select } from 'antd';

const ModeSelect: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const model = useSelector((state: RootState) => state.chat.model);

    const handleChange = (value: string) => {
        dispatch(setModel(value as 'gemini' | 'deepseek' | 'llama' | 'qwen')); // Cập nhật kiểu dữ liệu
    };

    return (
        <div className="">
            <Select
                defaultValue="gemini" // Đổi defaultValue thành 'gemini' để đồng bộ với initialState
                style={{ width: 140 }}
                onChange={handleChange}
                value={model}
                options={[
                    { value: 'gemini', label: 'Gemini 2.0 Flash' },
                    { value: 'deepseek', label: 'DeepSeek v3' }, // Thêm DeepSeek
                    { value: 'llama', label: 'Llama 3.3' },
                    { value: 'qwen', label: 'Qwen 32B' },
                ]}
            />
        </div>
    );
};

export default ModeSelect;