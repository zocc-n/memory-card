const Card = ({name, src}) => {

    return (
        <>
            <div className="card">
                <img src={src} alt={name} />
                <p>{name}</p>
            </div>
        </>
    )
}

export default Card