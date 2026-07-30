import React, { type SelectHTMLAttributes } from "react";

export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'error'> {
    label?: string;
    name: string;
    options: { id: string | number; name: string }[];
    error?: string | string[];
    wrapperClassName?: string;
    selectClassName?: string;
    variant?: 'default' | 'filter';
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({
         label,
         name,
         value,
         options,
         required = false,
         error,
         onChange,
         wrapperClassName = '',
         selectClassName = '',
         variant = 'default',
         ...props
     }, ref) => {
         const errorMessage = Array.isArray(error) ? error[0] : error;

         const baseStyles = "transition appearance-none cursor-pointer outline-none";
         const variantStyles = {
             default: "bg-zinc-800 text-zinc-100 rounded-xl px-4 py-3 border border-zinc-700 focus:border-red-500",
             filter: "bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 border-none rounded-full py-2 px-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-zinc-700 pr-8"
         };

         return (
             <div className={`flex flex-col ${wrapperClassName}`}>
                 {label && (
                     <label className="text-zinc-400 mb-1 font-semibold">{label}</label>
                 )}

                 <select
                     ref={ref}
                     name={name}
                     value={value}
                     required={required}
                     onChange={onChange}
                     className={`${baseStyles} ${variantStyles[variant]}
                         ${errorMessage ? 'border-red-500' : ''}
                         ${selectClassName}
                     `}
                     {...props}
                 >
                     <option value="" disabled>Оберіть...</option>
                     {options.map(option => (
                         <option key={option.id} value={option.id}>
                             {option.name}
                         </option>
                     ))}
                 </select>

                 {errorMessage && (
                     <span className="text-red-500 text-sm mt-1 font-semibold">
                         {errorMessage}
                     </span>
                 )}
             </div>
         );
     }
);

SelectField.displayName = "SelectField";

