import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import type { Step } from 'react-joyride';

export const Tutorial: React.FC = () => {
    const [run, setRun] = useState(false);

    useEffect(() => {
        // Check if tutorial was already completed
        const hasCompletedTutorial = localStorage.getItem('cde_tutorial_completed');
        if (!hasCompletedTutorial) {
            setRun(true);
        }
    }, []);

    const steps: Step[] = [
        {
            target: 'body',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-lg mb-2 text-cde-text uppercase tracking-widest">¡Bienvenido al Tracker!</h3>
                    <p className="text-sm leading-relaxed">
                        Este es tu nuevo centro de mando personal. Vamos a dar un rápido recorrido animado para que entiendas cómo convertirte en la mejor versión de ti mismo.
                    </p>
                </div>
            ),
            placement: 'center',
        },
        {
            target: '.nav-dashboard',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-1">Dashboard</h3>
                    <p className="text-sm">Aquí verás tu resumen diario: las tareas pendientes de hoy y los hábitos que debes marcar antes de dormir.</p>
                </div>
            ),
        },
        {
            target: '.nav-metas',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-1">Gestión de Metas</h3>
                    <p className="text-sm">Crea objetivos grandes a largo plazo, y divídelos en pequeñas tareas ejecutables. ¡Divide y vencerás!</p>
                </div>
            ),
        },
        {
            target: '.nav-habitos',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-1">Tus Hábitos</h3>
                    <p className="text-sm">Configura qué días de la semana quieres realizar ciertas rutinas. Se generarán automáticamente en tu Dashboard.</p>
                </div>
            ),
        },
        {
            target: '.nav-perfil',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-1">Perfil RPG</h3>
                    <p className="text-sm">¡La mejor parte! Aquí verás tu Nivel, la experiencia que has ganado, tus Atributos de Personaje (en un gráfico de araña) y tácticas para subir tus métricas a 100.</p>
                </div>
            ),
        }
    ];

    const handleJoyrideCallback = (data: any) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
            setRun(false);
            localStorage.setItem('cde_tutorial_completed', 'true');
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            onEvent={handleJoyrideCallback}
            locale={{
                back: 'Atrás',
                close: 'Cerrar',
                last: '¡Empezar!',
                next: 'Siguiente',
                skip: 'Saltar'
            }}
        />
    );
};
