// TeamFormFields.js
'use client';

import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function TeamFormFields({ formData, handleChange, handleSelectChange }) {
    return (
    <>
        <div className="col-span-1">
            <h3 className="text-white/80 text-lg font-semibold mb-2">TEAM NAME</h3>
            <label htmlFor="teamName" className="sr-only block text-sm text-white/60 mb-1">Team Name</label>
            <Input
                id="teamName"
                name="teamName"
                placeholder="Team Name"
                value={formData.teamName}
                onChange={handleChange}
                className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 text-lg focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
        </div>

        <div className="col-span-1 relative">
            <h3 className="text-white/80 text-lg font-semibold mb-2">DERBY</h3>
            <label htmlFor="derby" className="sr-only block text-lg font-semibold text-white/80 mb-2">Derby</label>
            <Select value={formData.derby} onValueChange={(value) => handleSelectChange('derby', value)}>
            <SelectTrigger className="relative flex justify-start align-center w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg">
                {/* Placeholder and selected value */}
                <SelectValue 
                placeholder="Will you play in the derby?" 
                className="text-white/60 text-lg" 
                />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
            </SelectContent>
            </Select>
        </div>
     

        <div className="col-span-1">
            <h3 className="text-white/80 text-lg font-semibold mb-2">PLAYER ONE</h3>
          <div className="mt-3">
            <label htmlFor="playerOneName" className="sr-only hidden block text-sm text-white/60 mb-1">Player One Name</label>
            <Input
              id="playerOneName"
              name="playerOneName"
              placeholder="Player One Name"
              value={formData.playerOneName}
              onChange={handleChange}
              className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
          </div>
          <div className="mt-3">
            <label htmlFor="playerOneHandicap" className="sr-only hidden block text-sm text-white/60 mb-1">Player One Handicap</label>
            <Input
              id="playerOneHandicap"
              name="playerOneHandicap"
              placeholder="Player One Handicap"
              value={formData.playerOneHandicap}
              onChange={handleChange}
              className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
          </div>
          <div className="mt-3">
            <label htmlFor="playerOneTShirtSize" className="sr-only hidden block text-sm text-white/60 mb-1">Player One T-Shirt Size</label>
            <Input
              id="playerOneTShirtSize"
              name="playerOneTShirtSize"
              placeholder="Player One T-Shirt Size"
              value={formData.playerOneTShirtSize}
              onChange={handleChange}
              className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
          </div>
        </div>

        <div className="col-span-1">
          <h3 className="text-white/80 text-lg font-semibold mb-2">PLAYER TWO</h3>
          <div className="mt-3">
            <label htmlFor="playerTwoName" className="sr-only hidden block text-sm text-white/60 mb-1">Player Two Name</label>
            <Input
              id="playerTwoName"
              name="playerTwoName"
              placeholder="Player Two Name"
              value={formData.playerTwoName}
              onChange={handleChange}
              className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
          </div>
          <div className="mt-3">
            <label htmlFor="playerTwoHandicap" className="sr-only hidden block text-sm text-white/60 mb-1">Player Two Handicap</label>
            <Input
              id="playerTwoHandicap"
              name="playerTwoHandicap"
              placeholder="Player Two Handicap"
              value={formData.playerTwoHandicap}
              onChange={handleChange}
              className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
          </div>
          <div className="mt-3">
            <label htmlFor="playerTwoTShirtSize" className="sr-only hidden block text-sm text-white/60 mb-1">Player Two T-Shirt Size</label>
            <Input
              id="playerTwoTShirtSize"
              name="playerTwoTShirtSize"
              placeholder="Player Two T-Shirt Size"
              value={formData.playerTwoTShirtSize}
              onChange={handleChange}
              className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
          </div>
        </div>

        <div className="col-span-1">
          <h3 className="text-white/80 text-lg font-semibold mb-2">PLAYER THREE</h3>
          <div className="mt-3">
            <label htmlFor="playerThreeName" className="sr-only hidden block text-sm text-white/60 mb-1">Player Three Name</label>
            <Input
              id="playerThreeName"
              name="playerThreeName"
              placeholder="Player Three Name"
              value={formData.playerThreeName}
              onChange={handleChange}
              className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
          </div>
          <div className="mt-3">
            <label htmlFor="playerThreeHandicap" className="sr-only hidden block text-sm text-white/60 mb-1">Player Three Handicap</label>
            <Input
              id="playerThreeHandicap"
              name="playerThreeHandicap"
              placeholder="Player Three Handicap"
              value={formData.playerThreeHandicap}
              onChange={handleChange}
              className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
          </div>
          <div className="mt-3">
            <label htmlFor="playerThreeTShirtSize" className="sr-only hidden block text-sm text-white/60 mb-1">Player Three T-Shirt Size</label>
            <Input
              id="playerThreeTShirtSize"
              name="playerThreeTShirtSize"
              placeholder="Player Three T-Shirt Size"
              value={formData.playerThreeTShirtSize}
              onChange={handleChange}
              className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
          </div>
        </div>

        <div className="col-span-1">
          <h3 className="text-white/80 text-lg font-semibold mb-2">TEAM CONTACT</h3>
          <div className="mt-3">
            <label htmlFor="teamContactName" className="sr-only hidden block text-sm text-white/60 mb-1">Team Contact Name</label>
            <Input
              id="playerThreeTShirtSize"
              name="playerThreeTShirtSize"
              placeholder="Team Contact Name"
              value={formData.teamContactName}
              onChange={handleChange}
              className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
          </div>

          <div className="mt-3">
            <label htmlFor="teamContactPhone" className="sr-only hidden block text-sm text-white/60 mb-1">Team Contact Phone</label>
            <Input
              id="teamContactPhone"
              name="teamContactPhone"
              placeholder="Team Contact Phone"
              value={formData.teamContactPhone}
              onChange={handleChange}
              className="block w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary placeholder:text-white/60 placeholder:text-lg"
            />
          </div>
        </div>

      {/* Banquet Info Group */}
      <div className="col-span-1">
            <h3 className="text-white/80 text-lg font-semibold mb-2">BANQUET</h3>
            <div className="mt-3">
            <label className="sr-only block text-sm text-white/60 mb-1">Will You Attend Banquet?</label>
            <Select value={formData.banquet} onValueChange={(value) => handleSelectChange('banquet', value)}>
                <SelectTrigger className="relative flex justify-start align-center w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg">
                <SelectValue placeholder="Will you attend the banquet?" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div className="mt-3">
            <label className="sr-only block text-sm text-white/60 mb-1">{
                `Additional Dinner Tickets ${formData.participantType === 'teamSponsorEntry' ? '3 Included ':'1 Included '}(+$32.00 each)`
            }</label>
            <Select value={formData.dinnerTickets} onValueChange={(value) => handleSelectChange('dinnerTickets', value)}>
                <SelectTrigger className="relative flex justify-start align-center w-full bg-customInputFill border border-customInputBorder p-6 rounded-xl text-white/60 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-customPrimary appearance-none placeholder:text-lg">
                <SelectValue placeholder={`Additional Dinner Tickets ${formData.participantType === 'teamSponsorEntry' ? '3 Included ':'1 Included '}(+$32.00 each)`} />
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

