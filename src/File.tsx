
interface FileProps {
    title: string;
    source: string;
    date: Date;
}

function File({title, source, date}: FileProps) {
    return (
        <div>
            <h1>{title}</h1>
        </div>
    );
}

export default File;