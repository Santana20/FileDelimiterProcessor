import FileRemoveLinesForm from '@/components/file-remove-lines-form';
import FilesDownload from '@/components/files-download';
import { removeLinesV1 } from '@/services/file-service';
import { FileResponse } from '@/types/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';

const steps = [
  {
    id: 1,
    title: 'Paso 1',
    name: 'Llenar datos',
  },
  {
    id: 2,
    title: 'Paso 2',
    name: 'Descargar archivos',
  },
]

const Home = () => {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const delta = currentStep - previousStep;

  const [filteredContent, setFilteredContent] = useState<FileResponse | null>(null);
  const [removedContent, setRemovedContent] = useState<FileResponse | null>(null);

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  const RenderStep = () => {
    return (
      <motion.div
        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}>
        {currentStep === 0 && (
          <FileRemoveLinesForm onSubmitForm={handleFileUpload} />
        )
        }
        {currentStep === 1 && (
          <FilesDownload filteredFileResponse={filteredContent} removedFileResponse={removedContent} />
        )
        }
      </motion.div>
    )
  }

  const handleFileUpload = async (file: File, rowsToRemove: number[], delimiter: string) => {
    console.log(file);

    const [error, responseData] = await removeLinesV1(file, rowsToRemove, delimiter)

    if (error) {
      toast.error(error.message)
      return
    }

    if (!responseData) {
      toast.error('Archivos generados no existen')
      return
    }

    setCurrentStep(step => step + 1)
    setFilteredContent(responseData.filteredFileResponse)
    setRemovedContent(responseData.removedFileResponse)
    toast.success('Archivos generados correctamente')
  };

  return (
    <>
      <Toaster></Toaster>
      <section className='h-screen flex flex-col justify-between p-24'>
        {/* Steps nav */}
        <nav aria-label='Progress'>
          <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
            {steps.map((step, index) => (
              <li key={step.name} className='md:flex-1'>
                {currentStep > index ? (
                  <div className='flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 group transition-colors border-sky-600'>
                    <span className='text-sm font-medium text-sky-600 transition-colors'>
                      {step.title}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                ) : currentStep === index ? (
                  <div
                    className='flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 border-sky-600'
                    aria-current='step'
                  >
                    <span className='text-sm font-medium text-sky-600'>
                      {step.title}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                ) : (
                  <div className='flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 group transition-colors border-gray-200'>
                    <span className='text-sm font-medium text-gray-500 transition-colors'>
                      {step.title}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Steps */}
        <RenderStep />

        {/* Navigation */}
        <div className='mt-8 pt-5'>
          <div className='flex justify-between'>
            {
              currentStep > 0 && (

                <button
                  type='button'
                  onClick={prev}
                  disabled={currentStep === 0}
                  className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 19.5L8.25 12l7.5-7.5'
                    />
                  </svg>
                </button>
              )
            }
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
