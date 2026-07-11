import {useEffect, useState} from "react";

function useObjectUrl(file: File | null | undefined): string {
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (!(file instanceof File)) {
            setUrl('');
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return url;
}