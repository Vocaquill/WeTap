import {Lock} from "lucide-react";
import React, {useState} from "react";
import {useChangePasswordMutation} from "../../../services/api/apiAccount.ts";
import {InputField} from "../../form/InputField";
import {Button} from "../../form/Button";
import {BaseModal} from '../common/BaseModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({isOpen, onClose}: Props) {
    const [changePassword] = useChangePasswordMutation();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("Паролі не збігаються!");
            return;
        }

        try {
            await changePassword({newPassword: formData.newPassword, oldPassword: formData.oldPassword}).unwrap();
            setErrorMessage("");
            setFormData({oldPassword: "", newPassword: "", confirmPassword: ""});
            onClose();
        } catch (err) {
            console.log("Помилка при зміні паролю", err);
            setErrorMessage("Сталася помилка при зміні паролю");
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Зміна паролю"
            headerIcon={<Lock size={20}/>}
            maxWidth="max-w-md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    type="password"
                    placeholder="Поточний пароль"
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                    inputClassName="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                />
                <InputField
                    type="password"
                    placeholder="Новий пароль"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    inputClassName="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                />
                <InputField
                    type="password"
                    placeholder="Підтвердіть пароль"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    inputClassName="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                />

                {errorMessage && (
                    <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="mt-4"
                >
                    Змінити пароль
                </Button>
            </form>
        </BaseModal>
    );
}
