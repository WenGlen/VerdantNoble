export default function PageTitle({ 
    title,
    mobile = "",
}) {
    return (
        <div className={`w-full flex flex-row items-center ${mobile==="hidden" ? "max-mobile:hidden" : ""}`}>
            <h1 className="text-2xl">{title}</h1>
            <div className="flex-1 h-10 border-b border-border-50"/>
        </div>
    )
}