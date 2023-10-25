const Card = ({ id, name, src, handleClick }) => {

    return (
        <>
            <div className="card" onClick={() => handleClick(id)}>
                <img src={src} alt={name} />
                <p>{name}</p>
            </div>
        </>
    )
}

export default Card