import React from 'react';

export default function Grades() {

    React.useEffect(() =>
    {
        // coloca aqui oq precisar renderizar apenas uma vez
    })
    
    React.useEffect(() =>
    {
        // coloca aqui oq precisar renderizar apenas uma vez.
        //  No segundo paramentro da função useEffect é passado uma array com os estados que ele vai monitorar se holver alteração

    }, ["nomeDoEstadoAtualizado"])

    return (
        <div>
            Rnderiza aqui
        </div>
    )
}
