import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import type { Step } from 'react-joyride';
import { useNavigate } from 'react-router-dom';

type CustomStep = Step & { route?: string };

const Tooltip = ({ index, step, backProps, closeProps, primaryProps, tooltipProps, isLastStep }: any) => {
    return (
        <div {...tooltipProps} className="bg-[#150f0e] border border-cde-text p-6 rounded-xl shadow-[0_0_30px_rgba(252,211,209,0.15)] max-w-sm text-cde-text-muted font-mono z-[10000]">
            <div className="mb-6">{step.content}</div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#352321]">
                {index > 0 ? (
                    <button {...backProps} className="text-xs uppercase tracking-widest text-[#d09d9d] hover:text-[#fcd3d1] transition-colors font-bold px-2 py-1">
                        Atrás
                    </button>
                ) : <div></div>}
                <div className="flex gap-4 ml-auto items-center">
                    {!isLastStep && (
                        <button {...closeProps} className="text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                            Saltar
                        </button>
                    )}
                    <button {...primaryProps} className="bg-[#fcd3d1] text-[#150f0e] px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                        {isLastStep ? '¡Comenzar!' : 'Siguiente'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Tutorial: React.FC = () => {
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const hasCompletedTutorial = localStorage.getItem('cde_tutorial_completed');
        if (!hasCompletedTutorial) {
            setRun(true);
        }
    }, []);

    const steps: CustomStep[] = [
        {
            target: 'body',
            route: '/',
            placement: 'center',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-xl mb-3 text-cde-text uppercase tracking-widest leading-tight">¡Bienvenido al<br/>Tracker!</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                        Este es tu nuevo centro de mando personal. Vamos a dar un rápido recorrido animado para que entiendas cómo convertirte en la mejor versión de ti mismo.
                    </p>
                </div>
            ),
        },
        {
            target: '.nav-dashboard',
            route: '/',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Dashboard</h3>
                    <p className="text-sm text-gray-300">Aquí verás tu resumen diario: las tareas pendientes de hoy y los hábitos que debes marcar antes de dormir.</p>
                </div>
            ),
        },
        {
            target: '.nav-metas',
            route: '/metas',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Gestión de Metas</h3>
                    <p className="text-sm text-gray-300">Crea objetivos grandes a largo plazo, y divídelos en pequeñas tareas ejecutables. ¡Divide y vencerás!</p>
                </div>
            ),
        },
        {
            target: '.nav-habitos',
            route: '/habitos',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Tus Hábitos</h3>
                    <p className="text-sm text-gray-300">Configura qué días de la semana quieres realizar ciertas rutinas. Se generarán automáticamente en tu Dashboard.</p>
                </div>
            ),
        },
        {
            target: '.nav-perfil',
            route: '/perfil',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Perfil RPG</h3>
                    <p className="text-sm text-gray-300">¡La mejor parte! Aquí verás tu progreso como si fueras el personaje principal de un videojuego.</p>
                </div>
            ),
        },
        {
            target: '.level-tutorial-target',
            route: '/perfil',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Sube de Nivel</h3>
                    <p className="text-sm text-gray-300">Completar tareas y hábitos te otorga <strong>Puntos de Experiencia (EXP)</strong>. ¡Acumula EXP para subir de nivel y desbloquear tu potencial!</p>
                </div>
            ),
        },
        {
            target: '.radar-tutorial-target',
            route: '/perfil',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-cde-text uppercase tracking-wide mb-2 text-lg">Tus Atributos</h3>
                    <p className="text-sm text-gray-300">Tus acciones definen tus estadísticas (Disciplina, Productividad, etc). Abajo encontrarás el "Análisis Táctico" que te dirá exactamente cómo mejorar cada una.</p>
                </div>
            ),
        },
        {
            target: 'body',
            route: '/perfil',
            placement: 'center',
            content: (
                <div className="text-left">
                    <h3 className="font-bold text-xl mb-3 text-cde-text uppercase tracking-widest">¡Estás Listo!</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                        El sistema está preparado. Dirígete a "Metas" para crear tu primer objetivo, o a "Hábitos" para empezar una rutina. ¡Mucho éxito!
                    </p>
                </div>
            ),
        }
    ];

    const handleJoyrideCallback = (data: any) => {
        const { action, index, status, type } = data;
        
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
            setRun(false);
            localStorage.setItem('cde_tutorial_completed', 'true');
            navigate('/');
        } else if (type === 'step:after' || type === 'error:target_not_found') {
            const nextStepIndex = index + (action === 'prev' ? -1 : 1);
            if (nextStepIndex >= 0 && nextStepIndex < steps.length) {
                const nextRoute = steps[nextStepIndex].route;
                if (nextRoute) {
                    navigate(nextRoute);
                }
                // Update step index to trigger the next step
                setStepIndex(nextStepIndex);
            }
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            stepIndex={stepIndex}
            continuous
            onEvent={handleJoyrideCallback}
            tooltipComponent={Tooltip}
        />
    );
};
