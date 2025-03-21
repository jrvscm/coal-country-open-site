// TeamFormFields.js
'use client';
import React from 'react';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FormDataType } from '@/components/registration-form';

interface TeamFormFieldsProps {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void; 
  formErrors: Partial<FormDataType>;
}

const TeamFormFields: React.FC<TeamFormFieldsProps> = ({ formData, handleChange, handleSelectChange, formErrors }) => {
    return (
    <>
        <div className="col-span-2">
            <h3 className="text-white/80 text-lg font-semibold mb-2">TEAM NAME</h3>
            <label htmlFor="teamName" className="sr-only block text-sm text-white/60 mb-1">Team Name</label>
            <Input
              id="teamName"
              name="teamName"
              placeholder="Team Name"
              value={formData.teamName}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.teamName ? 'border-red-500' : 'border-customInputBorder'}
              `} 
            />
            {formErrors.teamName && <p className="text-red-500 text-sm mt-1">{formErrors.teamName}</p>}
        </div>

        <div className="col-span-2">
          <h3 className="text-white/80 text-lg font-semibold mb-2">PLAYER ONE</h3>
          <div className="mt-3">
            <label htmlFor="player1Name" className="sr-only hidden block text-sm text-white/60 mb-1">Player One Name</label>
            <Input
              id="player1Name"
              name="player1Name"
              placeholder="Player One Name"
              value={formData.player1Name}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.player1Name ? 'border-red-500' : 'border-customInputBorder'}
              `} 
            />
            {formErrors.player1Name && <p className="text-red-500 text-sm mt-1">{formErrors.player1Name}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="player1Handicap" className="sr-only hidden block text-sm text-white/60 mb-1">Player One Handicap</label>
            <Input
              id="player1Handicap"
              name="player1Handicap"
              placeholder="Player One Handicap"
              value={formData.player1Handicap}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.player1Handicap ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.player1Handicap && <p className="text-red-500 text-sm mt-1">{formErrors.player1Handicap}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="player1TShirtSize" className="sr-only hidden block text-sm text-white/60 mb-1">Player One T-Shirt Size</label>
            <Input
              id="player1TShirtSize"
              name="player1TShirtSize"
              placeholder="Player One T-Shirt Size"
              value={formData.player1TShirtSize}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.player1TShirtSize ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.player1TShirtSize && <p className="text-red-500 text-sm mt-1">{formErrors.player1TShirtSize}</p>}
          </div>
        </div>

        <div className="col-span-2">
          <h3 className="text-white/80 text-lg font-semibold mb-2">PLAYER TWO</h3>
          <div className="mt-3">
            <label htmlFor="player2Name" className="sr-only hidden block text-sm text-white/60 mb-1">Player Two Name</label>
            <Input
              id="player2Name"
              name="player2Name"
              placeholder="Player Two Name"
              value={formData.player2Name}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.player2Name ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.player2Name && <p className="text-red-500 text-sm mt-1">{formErrors.player2Name}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="player2Handicap" className="sr-only hidden block text-sm text-white/60 mb-1">Player Two Handicap</label>
            <Input
              id="player2Handicap"
              name="player2Handicap"
              placeholder="Player Two Handicap"
              value={formData.player2Handicap}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.player2Handicap ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.player2Handicap && <p className="text-red-500 text-sm mt-1">{formErrors.player2Handicap}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="player2TShirtSize" className="sr-only hidden block text-sm text-white/60 mb-1">Player Two T-Shirt Size</label>
            <Input
              id="player2TShirtSize"
              name="player2TShirtSize"
              placeholder="Player Two T-Shirt Size"
              value={formData.player2TShirtSize}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.player2TShirtSize ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.player2TShirtSize && <p className="text-red-500 text-sm mt-1">{formErrors.player2TShirtSize}</p>}
          </div>
        </div>

        <div className="col-span-2">
          <h3 className="text-white/80 text-lg font-semibold mb-2">PLAYER THREE</h3>
          <div className="mt-3">
            <label htmlFor="player3Name" className="sr-only hidden block text-sm text-white/60 mb-1">Player Three Name</label>
            <Input
              id="player3Name"
              name="player3Name"
              placeholder="Player Three Name"
              value={formData.player3Name}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.player3Name ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.player3Name && <p className="text-red-500 text-sm mt-1">{formErrors.player3Name}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="player3Handicap" className="sr-only hidden block text-sm text-white/60 mb-1">Player Three Handicap</label>
            <Input
              id="player3Handicap"
              name="player3Handicap"
              placeholder="Player Three Handicap"
              value={formData.player3Handicap}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.player3Handicap ? 'border-red-500' : 'border-customInputBorder'}
              `}
            />
            {formErrors.player3Handicap && <p className="text-red-500 text-sm mt-1">{formErrors.player3Handicap}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="player3TShirtSize" className="sr-only hidden block text-sm text-white/60 mb-1">Player Three T-Shirt Size</label>
            <Input
              id="player3TShirtSize"
              name="player3TShirtSize"
              placeholder="Player Three T-Shirt Size"
              value={formData.player3TShirtSize}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.player3TShirtSize ? 'border-red-500' : 'border-customInputBorder'}
              `} 
            />
            {formErrors.player3TShirtSize && <p className="text-red-500 text-sm mt-1">{formErrors.player3TShirtSize}</p>}
          </div>
        </div>

        <div className="col-span-2">
          <h3 className="text-white/80 text-lg font-semibold mb-2">TEAM CONTACT</h3>
          <div className="mt-3">
            <label htmlFor="teamContactName" className="sr-only hidden block text-sm text-white/60 mb-1">Team Contact Name</label>
            <Input
              id="teamContactName"
              name="teamContactName"
              placeholder="Team Contact Name"
              value={formData.teamContactName}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.teamContactName ? 'border-red-500' : 'border-customInputBorder'}
              `} 
            />
            {formErrors.teamContactName && <p className="text-red-500 text-sm mt-1">{formErrors.teamContactName}</p>}
          </div>

          <div className="mt-3">
            <label htmlFor="teamContactPhone" className="sr-only hidden block text-sm text-white/60 mb-1">Team Contact Phone</label>
            <Input
              id="teamContactPhone"
              name="teamContactPhone"
              placeholder="Team Contact Phone"
              value={formData.teamContactPhone}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.teamContactPhone? 'border-red-500' : 'border-customInputBorder'}
              `} 
            />
            {formErrors.teamContactPhone && <p className="text-red-500 text-sm mt-1">{formErrors.teamContactPhone}</p>}
          </div>
          <div className="mt-3">
            <label htmlFor="teamContactEmail" className="sr-only hidden block text-sm text-white/60 mb-1">Team Contact Email</label>
            <Input
              id="teamContactEmail"
              name="teamContactEmail"
              placeholder="Team Contact Email"
              value={formData.teamContactEmail}
              onChange={handleChange}
              className={`block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg
                ${formErrors.teamContactEmail ? 'border-red-500' : 'border-customInputBorder'}
              `} 
            />
            {formErrors.teamContactEmail && <p className="text-red-500 text-sm mt-1">{formErrors.teamContactEmail}</p>}
          </div>
        </div>

        {/* Banquet Info Group */}
        <div className="col-span-2">
            <h3 className="text-white/80 text-lg font-semibold mb-2">BANQUET</h3>
            <div className="mt-3">
              <label className="sr-only block text-sm text-white/60 mb-1">Will You Attend Banquet?</label>
              <Select value={formData.banquet} onValueChange={(value) => handleSelectChange('banquet', value)}>
                <SelectTrigger className={`relative flex justify-start align-center w-full bg-customInputFill border p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg 
                  ${formErrors.banquet ? 'border-red-500' : 'border-customInputBorder'}
                `}>
                  <SelectValue placeholder="Will attend the banquet? (3 tickets incl.)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.banquet && <p className="text-red-500 text-sm mt-1">{formErrors.banquet}</p>}
            </div>
            <div className="mt-3">
            <label className="sr-only block text-sm text-white/60 mb-1">{
                `Additional Dinner Tickets (+$32.00 each)`
            }</label>
            <Select value={formData.dinnerTickets} onValueChange={(value) => handleSelectChange('dinnerTickets', value)}>
                <SelectTrigger className="relative flex justify-start align-center w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg">
                <SelectValue placeholder={`Additional Dinner Tickets (+$32.00 each)`} />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="10">10</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>
    </>
    );
}

export default TeamFormFields;